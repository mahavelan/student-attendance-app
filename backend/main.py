# backend/main.py

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from face_utils import recognize_faces
from models import save_attendance
import shutil
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/match_faces/")
async def match_faces(batch: str = Form(...), file: UploadFile = File(...)):
    temp_file = "temp.jpg"
    with open(temp_file, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    names = recognize_faces(batch, temp_file)
    os.remove(temp_file)

    save_attendance(batch, names)

    return {"matched": names}
