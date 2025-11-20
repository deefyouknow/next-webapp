"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

// TypeScript props
interface Props {
  pos: { lat: number; lng: number } | null;
  setPos: (p: { lat: number; lng: number }) => void;
  elev: number | null;
  setElev: (e: number) => void;
}

// Component สำหรับกดบนแผนที่
function LocationPicker({ setPos, setElev }: Props) {
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

// ดึงความสูงจาก API
async function fetchElevation(
  lat: number,
  lng: number,
  setElev: (e: number) => void
) {
  try {
    const res = await fetch(
      `https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lng}`
    );
    const data = await res.json();
    setElev(data.results[0].elevation);
  } catch {
    setElev(-999);
  }
}

export default function MapView({ pos, setPos, elev, setElev }: Props) {
  // ใช้ GPS
  const getGPS = () => {
    navigator.geolocation.getCurrentPosition(async (res) => {
      const lat = res.coords.latitude;
      const lng = res.coords.longitude;
      setPos({ lat, lng });
      fetchElevation(lat, lng, setElev);
    });
  };

  return (
    <div>
      <button
        style={{ padding: 10, marginBottom: 10 }}
        onClick={getGPS}
      >
        ใช้ GPS ระบุตำแหน่ง
      </button>

      <MapContainer
        center={[13.736717, 100.523186]}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <LocationPicker setPos={setPos} setElev={setElev} />

        {pos && <Marker icon={markerIcon} position={[pos.lat, pos.lng]} />}
      </MapContainer>
    </div>
  );
}
