from fastapi import APIRouter, UploadFile, File
import os
import shutil
from uuid import uuid4

router = APIRouter(
    prefix="/api/upload",
    tags=["Upload"]
)

UPLOAD_DIR = "uploads/posters"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/poster")
def upload_poster(file: UploadFile = File(...)):
    ext = file.filename.split(".")[-1]

    filename = f"{uuid4()}.{ext}"

    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_url = f"https://cinema-syx8.onrender.com/uploads/posters/{filename}"

    return {
        "filename": filename,
        "url": file_url
    }