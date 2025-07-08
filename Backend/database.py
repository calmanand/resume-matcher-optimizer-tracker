from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URI = os.getenv("MONGODB_URI")

client = MongoClient(MONGO_URI)
db = client.resume_db
collection = db["user_data"]