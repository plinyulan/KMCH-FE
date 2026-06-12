import { useEffect, useState, useCallback } from "react";
import "./Display.css";
import { apiGet } from "../services/api";

const POLL_MS = 5000;

function RoomCard({ room }) {
  const patients = room.patients ?? [];
  return (
    <div className="display-room-card">
      <div className="display-room-header">
        <span className="display-room-name">{room.room_name}</span>
        <span className={`display-room-badge ${patients.length > 0 ? "in" : "free"}`}>
          {patients.length > 0 ? "กำลังพบแพทย์" : "ว่าง"}
        </span>
      </div>
      <div className="display-room-body">
        {patients.length === 0 ? (
          <span className="display-room-empty">ไม่มีผู้ป่วย</span>
        ) : (
          patients.map((p, i) => (
            <div key={i} className="display-room-patient">
              <span className="display-patient-name">
                {p.first_name} {p.last_name}
              </span>
              <span className="display-patient-id">xxxx-{p.masked_id}</span>
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
              <span className="display-patient-name">
                {p.first_name} {p.last_name}
              </span>
              <span className="display-patient-id">xxxx-{p.masked_id}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Display() {
  const [data, setData] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const resp = await apiGet("/display");
      setData(resp);
      setLastUpdate(new Date());
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

  const left = rooms.slice(0, 3);   // Room 1, 2, 3
  const right = rooms.slice(3, 5);  // Room 4, 5

  return (
    <div className="display-page">
      {/* Header */}
      <div className="display-header">
        <h1 className="display-title">QUEUE FOR DOCTOR</h1>
        {lastUpdate && (
          <span className="display-updated">
            อัปเดต {lastUpdate.toLocaleTimeString("th-TH")}
          </span>
        )}
      </div>

      {/* 6-section grid: left 3 rooms | right 2 rooms + waiting */}
      <div className="display-grid">
        {/* Left column */}
        <div className="display-col">
          {left.map((room) => (
            <RoomCard key={room.room_id} room={room} />
          ))}
        </div>

        {/* Right column */}
        <div className="display-col">
          {right.map((room) => (
            <RoomCard key={room.room_id} room={room} />
          ))}
          <WaitingPanel patients={waiting} />
        </div>
      </div>
    </div>
  );
}

export default Display;
