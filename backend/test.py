from backend.app.db.database import engine

try:
    conn = engine.connect()
    print("✅ Kết nối DB thành công!")
    conn.close()
except Exception as e:
    print("❌ Lỗi:", e)