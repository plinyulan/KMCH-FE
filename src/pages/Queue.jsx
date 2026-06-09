import { useEffect, useState } from "react";
import "./Queue.css";
import image from "../image/queue.png";

function Queue() {
  const [queueData, setQueueData] = useState({
    queueCount: 0,
    queueNo: "0129",
    name: "Pathumwadee DA",
    room: "ห้องตรวจที่ 1",
    status: "waiting",
  });

  const [loading, setLoading] = useState(true);

  const fetchQueue = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/queue");
      const data = await res.json();

      setQueueData({
        queueCount: data.queueCount ?? 0,
        queueNo: data.queueNo ?? "0129",
        name: data.name ?? "Pathumwadee DA",
        room: data.room ?? "ห้องตรวจที่ 1",
        status: data.status ?? "waiting",
      });
    } catch (error) {
      console.error("โหลดข้อมูลคิวไม่สำเร็จ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();

    const interval = setInterval(() => {
      fetchQueue();
    }, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="queue-page">
      <div className="queue-card">
        <div className="queue-icon">
          <img
            src={image}
            alt="Queue Success"
            className="queue-success-image"
          />
        </div>

        <h1 className="queue-main-title">
          คุณได้เข้าสู่ระบบคิวเรียบร้อยแล้ว
        </h1>

        <p className="queue-count">
          ตอนนี้คิวที่รออยู่ก่อนหน้า:{" "}
          <span>{loading ? "..." : queueData.queueCount}</span> คิว
        </p>

        {queueData.status === "waiting" && (
          <div className="queue-info-box">
            <p className="queue-info-text">
              คิวของคุณ : {queueData.queueNo}
            </p>

            <p className="queue-name-text">
              {queueData.name}
            </p>

            <p className="queue-room-text">
              ห้องที่รับบริการคือ {queueData.room}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Queue;