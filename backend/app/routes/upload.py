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
    # Lấy phần mở rộng file
    ext = file.filename.split(".")[-1]

    # Tạo tên file ngẫu nhiên
    filename = f"{uuid4()}.{ext}"

    # Đường dẫn lưu file
    file_path = os.path.join(UPLOAD_DIR, filename)

    # Ghi file xuống ổ đĩa
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # URL truy cập file
    file_url = f"http://127.0.0.1:8000/uploads/posters/{filename}"

    return {
        "filename": filename,
        "url": file_url
    }