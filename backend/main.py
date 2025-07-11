# backend/main.py

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from face_utils import recognize_faces
from models import save_attendance
import shutil
import os

app = FastAPI()

# Allow frontend to access backend (adjust origins as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload/")
async def upload_image(batch: str = Form(...), file: UploadFile = File(...)):
    temp_file = "temp.jpg"
    with open(temp_file, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    recognized_names, absent_names, total_present, total_absent = recognize_faces(batch, temp_file)
    os.remove(temp_file)

    # Save attendance log (present list only)
    save_attendance(batch, recognized_names)

    return {
        "status": "success",
        "batch": batch,
        "present_count": total_present,
        "absent_count": total_absent,
        "present_list": recognized_names,
        "absent_list": absent_names
    }
