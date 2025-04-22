# backend/db.py
from pymongo import MongoClient
import gridfs

MONGO_URI = "mongodb+srv://katkurishanthanreddy:IPtZkZ3R46ZUBfRy@cluster0.gsjygmu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = MongoClient(MONGO_URI)
db = client["automl_lite"]
fs = gridfs.GridFS(db)
files_collection = db["files"]
