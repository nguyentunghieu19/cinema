from fastapi import APIRouter, UploadFile, File, HTTPException
import cloudinary
import cloudinary.uploader
import os

router = APIRouter(
    prefix="/api/upload",
    tags=["Upload"]
)

# Cấu hình Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

@router.post("/poster")
async def upload_poster(file: UploadFile = File(...)):
    # Kiểm tra định dạng file
    allowed_types = ["image/jpeg", "image/png", "image/webp", "image/jpg"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Chỉ chấp nhận file ảnh JPG, PNG, WEBP")

    try:
        # Đọc file và upload thẳng lên Cloudinary
        contents = await file.read()

        result = cloudinary.uploader.upload(
            contents,
            folder="cinema/posters",   # Lưu vào folder riêng trên Cloudinary
            resource_type="image",
            format="webp",             # Tự động convert sang webp (nhẹ hơn)
            quality="auto",            # Tự động tối ưu chất lượng
        )

        return {
            "filename": result["public_id"],
            "url": result["secure_url"]  # URL vĩnh viễn, không bao giờ mất
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload thất bại: {str(e)}")