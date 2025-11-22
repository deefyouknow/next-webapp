"use client";

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

// Props ของ LocationPicker เฉพาะที่ต้องใช้
interface PickerProps {
  setPos: (p: { lat: number; lng: number }) => void;
  setElev: (e: number) => void;
}

// Props ของ MapView
interface Props {
  pos: { lat: number; lng: number } | null;
  setPos: (p: { lat: number; lng: number }) => void;
  elev: number | null;
  setElev: (e: number) => void;
}

// Component สำหรับคลิกเลือกตำแหน่งบนแผนที่
function LocationPicker({ setPos, setElev }: PickerProps) {
  useMapEvents({
    click: async (e) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      setPos({ lat, lng });
      fetchElevation(lat, lng, setElev);
    },
  });
  return null;
}

// ดึงความสูง
async function fetchElevation(
  lat: number,
  lng: number,
  setElev: (e: number) => void
) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_OPEN_ELEVATION_API_URL}/api/v1/lookup?locations=${lat},${lng}`
    );
    const data = await res.json();
    setElev(data.results[0].elevation);
  } catch {
    setElev(-999);
  }
}

function MapUpdater({ pos }: { pos: { lat: number; lng: number } | null }) {
  const map = useMap();

  if (pos) {
    map.flyTo([pos.lat, pos.lng], map.getZoom());
  }

  return null;
}

export default function MapView({ pos, setPos, elev, setElev }: Props) {

  // ***** ฟังก์ชัน GPS แบบรองรับ iPhone Safari *****
  const getGPS = () => {
    if (!navigator.geolocation) {
      alert("เบราว์เซอร์ไม่รองรับ GPS");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (res) => {
        const lat = res.coords.latitude;
        const lng = res.coords.longitude;

        setPos({ lat, lng });
        fetchElevation(lat, lng, setElev);
      },
      (err) => {
        alert("ไม่สามารถเข้าถึง GPS: " + err.message);
      },
      {
        enableHighAccuracy: true,      // สำคัญสำหรับ iPhone
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-center p-5">
        <button className="bg-amber-600 w-40 hover:bg-amber-700 active:bg-amber-400 rounded-sm h-10" onClick={getGPS}>
          ใช้ GPS ระบุตำแหน่ง
        </button>
      </div>
      <div className="h-100">
        <MapContainer
          center={[13.736717, 100.523186]}
          zoom={13}
          // style={{ height: "500px", width: "100%" }}
          className="h-100 w-100dvw"
        >

          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            // reuseTiles={true}
            detectRetina={true}
          />

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin text-amber-600">Loading map...</div>


          <LocationPicker setPos={setPos} setElev={setElev} />

          {pos && <Marker icon={markerIcon} position={[pos.lat, pos.lng]} />}

          <MapUpdater pos={pos} />
        </MapContainer>
      </div>
    </div>
  );
}
