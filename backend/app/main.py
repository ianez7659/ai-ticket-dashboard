from .db import engine
from .models import Base
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from .db import get_db
from fastapi.middleware.cors import CORSMiddleware
from .routes import tickets, dashboard

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(tickets.router)
app.include_router(dashboard.router)


@app.get("/")
def root(db: Session = Depends(get_db)):
    """Root endpoint to check database connection"""
    return {"msg": "DB connected 🚀"}


