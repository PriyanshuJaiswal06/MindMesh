# MindMesh 🧠

> **Transforming information overload into connected intelligence.**

MindMesh is a privacy-first AI knowledge intelligence system. Save articles, PDFs, and webpages — then search and chat with your personal knowledge base using AI that answers *only* from your own saved content.

---

## What It Does

Most people open 20+ tabs while researching, forget what they read, and never revisit saved links. MindMesh fixes this.

**The core loop:**
```
Save a webpage or PDF → AI processes it in background → Ask questions in plain English → Get answers from YOUR content
```

No generic internet answers. No data sent to third parties. Just your knowledge, made intelligent.

---

## Features

- 🔐 **Secure Auth** — Register and login with JWT-based authentication
- 💾 **Save Anything** — Save webpages by URL or upload PDFs directly
- 🔍 **Smart Search** — Full-text search across all your saved content
- 🤖 **Ask AI** — Chat with your knowledge base using RAG (Retrieval-Augmented Generation)
- 🔒 **Privacy First** — Your data is isolated, never mixed with other users
- ⚡ **Background Processing** — AI indexing happens async, never slows you down

---
## Tech Stack

### Frontend
| Technology | Purpose |
|---         |---      |
| Next.js 16 | Framework + routing |
| React      | UI components |
| Tailwind CSS | Styling |
| JavaScript (ES6+) | Language |

### Backend
| Technology | Purpose |
|---|---|
| FastAPI | API framework |
| PostgreSQL | User data + article metadata |
| ChromaDB | Vector embeddings storage |
| sentence-transformers | Text embeddings (all-MiniLM-L6-v2) |
| Google Gemini 2.5 Flash | AI response generation |
| trafilatura | Web content extraction |
| PyMuPDF | PDF text extraction |

---

## Project Structure

```
MindMesh/
├── backend/
│   ├── main.py          # FastAPI app + all endpoints
│   ├── auth.py          # JWT authentication
│   ├── database.py      # PostgreSQL connection
│   ├── models.py        # Database models
│   ├── schemas.py       # Pydantic schemas
│   ├── extraction.py    # Web + PDF content extraction
│   ├── vector_store.py  # ChromaDB + embeddings
│   ├── llm.py           # Gemini RAG pipeline
│   └── docs/
│       ├── API_REFERENCE.md
│       └── ARCHITECTURE.md
└── frontend/
    ├── app/
    │   ├── login/        # Login page
    │   ├── register/     # Register page
    │   └── dashboard/
    │       ├── page.jsx  # Save URL + upload PDF
    │       ├── search/   # Search saved content
    │       └── ask/      # AI chat interface
    └── lib/
        └── api.js        # All backend API calls
```

---
## Getting Started

### Prerequisites
- Python 3.12+
- Node.js 18+
- PostgreSQL 18

### 1. Clone the repo

```bash
git clone https://github.com/PriyanshuJaiswal06/MindMesh.git
cd MindMesh
```

### 2. Backend Setup

```bash
cd backend
pip install fastapi uvicorn sqlalchemy psycopg2-binary trafilatura PyMuPDF chromadb sentence-transformers langchain-text-splitters google-generativeai "python-jose[cryptography]" "passlib[bcrypt]" python-multipart google-genai bcrypt==4.0.1
```

Create a PostgreSQL database:
```bash
psql -U postgres
CREATE DATABASE mindmesh;
\q
```

Update `database.py` with your credentials:
```python
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:YOUR_PASSWORD@localhost:5432/mindmesh"
```

Set your environment variables:
```bash
# Windows
set GEMINI_API_KEY=your_gemini_api_key
set SECRET_KEY=your_secret_key

# Mac/Linux
export GEMINI_API_KEY=your_gemini_api_key
export SECRET_KEY=your_secret_key
```

Run the backend:
```bash
uvicorn main:app --reload
```

Backend runs at: `http://127.0.0.1:8000`
API docs available at: `http://127.0.0.1:8000/docs`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | No | Create account, returns JWT |
| POST | `/login` | No | Login, returns JWT |
| POST | `/save` | Yes | Save a webpage URL |
| POST | `/upload-pdf` | Yes | Upload a PDF file |
| GET | `/article/{id}` | Yes | Get a specific article |
| GET | `/search?query=` | Yes | Full-text search |
| GET | `/ask?query=` | Yes | AI answer from your knowledge base |

---

## How RAG Works

```
User asks a question
        ↓
Query converted to embedding vector
        ↓
ChromaDB finds top 5 similar chunks from USER'S saved content
        ↓
Chunks passed to Gemini as context
        ↓
Gemini answers using ONLY provided context
        ↓
Answer + source citations returned to user
```

This means the AI **cannot hallucinate** from general knowledge — it either finds the answer in your saved content or says it doesn't know.

---

## Team

| Name              | Role | Skills |
|---                |---   |---     |
| Priyanshu Jaiswal | Team Leader | Python |
| Supriya Jaiswal   | Frontend Developer | Frontend Development (React, Next.js), UI design (Tailwind CSS), REST API integration |
| Agam Sahu         | Backend Developer | Server-side programming (Python), Database management (SQL), API development |

---

## Future Roadmap

- [ ] Chrome Extension for one-click saving
- [ ] Knowledge graph visualization
- [ ] Team/shared knowledge bases
- [ ] Self-hosted deployment option
- [ ] Mobile app

---

## License
