import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    # OpenAI client will be None if API key is not set
    # This allows the app to start without OpenAI, but AI features won't work
    client = None
else:
    client = OpenAI(api_key=api_key)

