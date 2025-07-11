# backend/main.py

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from face_utils import recognize_faces
from models import save_attendance
import shutil
import os

app = FastAPI()

# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload/")
async def upload_image(batch: str, file: UploadFile = File(...)):
    temp_file = f"temp.jpg"
    with open(temp_file, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    names = recognize_faces(batch, temp_file)
    os.remove(temp_file)

    # Save attendance
    save_attendance(batch, names)

    return {"recognized": names}

