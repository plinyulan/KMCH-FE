import { useEffect, useState, useCallback } from "react";
import "./Display.css";
import { apiGet } from "../services/api";

const POLL_MS = 5000;

function getDisplayName(roomName) {
  const match = roomName?.match(/(\d+)/);
  return match ? `Exam.${String(match[1]).padStart(2, "0")}` : roomName;
}

function getRoomLabel(roomName) {
  const match = roomName?.match(/(\d+)/);
  return match ? `ห้องตรวจ${String(match[1]).padStart(2, "0")}` : roomName;
}

function formatPatient(p) {
  const lastName = (p.last_name ?? "").slice(0, 2);
  return {
    name: `${p.first_name} ${lastName}`,
    id: `xxxx-${p.masked_id}`,
  };
}

function RoomCard({ room }) {
  const patients = room.patients ?? [];
  const displayName = getDisplayName(room.room_name);
  return (
    <div className="display-room-card">
      <div className="display-room-header">
        <span className="display-room-name">{getRoomLabel(room.room_name)}</span>
        <span className={`display-room-badge ${patients.length > 0 ? "in" : "free"}`}>
          {displayName}
        </span>
      </div>
      <div className="display-room-body">
        {patients.length === 0 ? (
          <span className="display-room-empty">ไม่มีผู้ป่วย</span>
        ) : (
          patients.map((p, i) => (
            <div key={i} className="display-room-patient">
              <span className="display-patient-name">{formatPatient(p).name}</span>
              <span className="display-patient-id">{formatPatient(p).id}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function WaitingPanel({ patients }) {
  return (
    <div className="display-waiting-card">
      <div className="display-room-header">
        <span className="display-room-name">Waiting Queues</span>
        {patients.length > 0 && (
          <span className="display-waiting-badge">{patients.length} คน</span>
        )}
      </div>
      <div className="display-waiting-body">
        {patients.length === 0 ? (
          <span className="display-room-empty">ไม่มีผู้ป่วยรอ</span>
        ) : (
          patients.map((p, i) => (
            <div key={i} className="display-waiting-patient">
              <span className="display-patient-name">{formatPatient(p).name}</span>
              <span className="display-patient-id">{formatPatient(p).id}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Display() {
  const [data, setData] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const resp = await apiGet("/display");
      setData(resp);
    } catch {
      // keep old data on error
    }
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, POLL_MS);
    return () => clearInterval(id);
  }, [fetchData]);

  const rooms = data?.rooms ?? [];
  const waiting = data?.waiting ?? [];

  return (
    <div className="display-page">
      {/* Left: rooms | Right: waiting queue */}
      <div className="display-grid">
        {/* Left column */}
        <div className="display-col">
          <h2 className="display-section-title">ไปนั่งรอด้านในหน้าห้องตรวจ</h2>
          {rooms.map((room) => (
            <RoomCard key={room.room_id} room={room} />
          ))}
        </div>

        {/* Center divider */}
        <div className="display-divider" />

        {/* Right column */}
        <div className="display-col">
          <h2 className="display-section-title display-section-title--blue">นั่งรอคิวเรียกบนหน้าจอ</h2>
          <WaitingPanel patients={waiting} />
        </div>
      </div>
    </div>
  );
}

export default Display;
