from .db import engine
from .models import Base
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from .db import get_db
from fastapi.middleware.cors import CORSMiddleware
from .routes import tickets, dashboard, auth
from .auth.seed import seed_admin_if_empty

# Create database tables
Base.metadata.create_all(bind=engine)
# Create default admin user if no users exist
seed_admin_if_empty()

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
app.include_router(auth.router)
app.include_router(tickets.router)
app.include_router(dashboard.router)


@app.get("/")
def root(db: Session = Depends(get_db)):
    """Root endpoint to check database connection"""
    return {"msg": "DB connected 🚀"}


