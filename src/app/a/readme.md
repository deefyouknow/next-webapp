# **สิ่งที่ใช้ในไฟลนี้**
# 1) **HTML5 Geolocation**

> ใช้ตอนกดปุ่ม “ใช้ GPS ระบุตำแหน่ง”

**คือฟังก์ชันนี้:**

```JavaScript
navigator.geolocation.getCurrentPosition(...)
```

> อันนี้มาจาก เบราว์เซอร์ของผู้ใช้โดยตรง ฟรี 100% ไม่จำกัด

# 2) **OSM Tile (OpenStreetMap Tile)**

```JavaScript
<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
```

> โหลดภาพแผนที่จากเซิร์ฟเวอร์ของ OSM ฟรี แต่ไม่ unlimited (rate limit ถ้าโหลดเยอะ)

# 3) **open-elevation**

> ใช้ตรงนี้เวลาเรียกความสูง:

```JavaScript
fetch(
  `https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lng}`
)
```

> ฟรี แต่ไม่ unlimited ตอบกลับ elevation แบบจำนวนเต็ม

# สรุปสุดท้าย

- **HTML5 Geolocation:** ใช้หาพิกัด (Lat/Lng) จาก GPS เครื่อง

- **OSM Tile:** ใช้แสดง ภาพแผนที่ ให้ผู้ใช้เห็น

- **Open-Elevation:** ใช้คำนวณ ความสูง (Elevation)
