import os
from dotenv import load_dotenv

load_dotenv()

# JWT settings. Set JWT_SECRET_KEY in .env (use a long random string in production).
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "60"))  # default 1 hour
