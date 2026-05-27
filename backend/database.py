from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# replace 'u' and 'p' with pgSQL user and pass
SQLALCHEMY_DATABASE_URL = "postgresql://u:p@localhost:5432/mindmesh"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
