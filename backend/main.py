from fastapi import FastAPI, Depends, HTTPException, status, BackgroundTasks, UploadFile, File
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List

from vector_store import index_article_in_vector_db
from vector_store import search_similar_chunks
from llm import generate_rag_response

from database import engine, get_db
import models
import schemas
from extraction import (
    extract_web_content,
    extract_pdf_content,
    process_web_extraction_background
)
from auth import get_password_hash, verify_password, create_access_token, get_current_user

models.Base.metadata.create_all(bind=engine)

from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(
    title="MindMesh API",
    description="Transforming information overload into connected intelligence.",
    version="0.1.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/register", response_model=schemas.Token)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    try:
        hashed_pw = get_password_hash(user.password)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    new_user = models.User(email=user.email, hashed_password=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token = create_access_token(data={"sub": new_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/login", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
        
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/save", response_model=schemas.ArticleResponse, status_code=status.HTTP_201_CREATED)
def save_article(
    article: schemas.ArticleCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user) 
):

    print("SAVE ROUTE HIT")

    db_article = models.Article(
        user_id=current_user.id,
        url=str(article.url),
        title=article.title,
        extracted_text=article.extracted_text,
        categories=article.categories,
        metadata_info=article.metadata_info
    )

    db.add(db_article)
    db.commit()
    db.refresh(db_article)

    print("ARTICLE SAVED:", db_article.id)

    text_to_index = db_article.extracted_text

    if not text_to_index:
        print("NO extracted_text SENT, TRYING WEB EXTRACTION")
        text_to_index = extract_web_content(str(article.url))

        if text_to_index:
            db_article.extracted_text = text_to_index
            db.commit()
            db.refresh(db_article)
            print("WEB EXTRACTION DONE")
        else:
            print("NO TEXT FOUND TO INDEX")
            return db_article

    print("STARTING VECTOR INDEXING FOR SAVE")
    index_article_in_vector_db(
            article_id=db_article.id,
            user_id=db_article.user_id,
            text=text_to_index,
            title=db_article.title,
            url=db_article.url
        )
    print("VECTOR INDEXING FINISHED FOR SAVE")

    return db_article


@app.post("/upload-pdf", response_model=schemas.ArticleResponse, status_code=status.HTTP_201_CREATED)
async def upload_pdf(
    background_tasks: BackgroundTasks, 
    file: UploadFile = File(...), 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Receives a PDF upload, extracts the text immediately, and saves it to the database.
    """
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    try:
        file_bytes = await file.read()
        extracted_text = extract_pdf_content(file_bytes)

        db_article = models.Article(
            user_id=current_user.id,
            url=f"https://uploaded.local/{file.filename}",
            title=file.filename,
            extracted_text=extracted_text,
            categories="pdf",
            metadata_info={"filename": file.filename}
        )

        db.add(db_article)
        db.commit()
        db.refresh(db_article)
        
        # debug krne ke liye hai, baad me remove kar dena
        print("STARTING VECTOR INDEXING")
        
        background_tasks.add_task(
            index_article_in_vector_db, 
            db_article.id,
            db_article.user_id, 
            extracted_text, 
            db_article.title, 
            db_article.url
        )
        print("VECTOR INDEXING FINISHED")

        return db_article

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

#both below have filters cuz you won't like others sers seeing your articles, right?

@app.get("/article/{article_id}", response_model=schemas.ArticleResponse)
def get_article(
    article_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):

    article = db.query(models.Article).filter(
        models.Article.id == article_id,
        models.Article.user_id == current_user.id 
    ).first()
    
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article


@app.get("/search", response_model=List[schemas.ArticleResponse])
def search_articles(
    query: str, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if not query:
        return []
    search_term = f"%{query}%"
    
    articles = db.query(models.Article).filter(
        models.Article.user_id == current_user.id,
        (models.Article.title.ilike(search_term) | models.Article.extracted_text.ilike(search_term))
    ).all()
    
    return articles


@app.get("/ask")
def ask_mindmesh(
    query: str, 
    current_user: models.User = Depends(get_current_user)
):
    """
    Semantic Search and RAG Endpoint (GET /ask)
    """
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    
    search_results = search_similar_chunks(query=query, user_id=current_user.id)

    if not search_results:
        return {
            "query": query, 
            "response": "I couldn't find any relevant information whatsoever... maybe try relatable wordings from your saved articles.", 
            "sources": []
        }
    
    ai_response = generate_rag_response(query, search_results["chunks"])
    
    raw_sources = [{"title": m.get("title", "Unknown"), "url": m.get("url", "")} for m in search_results["metadatas"]]
    unique_sources = [dict(t) for t in {tuple(d.items()) for d in raw_sources}]
    
    return {
        "query": query,
        "response": ai_response,
        "sources": unique_sources
    }
