import { useEffect, useState } from "react";
import "./Queue.css";
import image from "../image/queue.png";
import { apiGet, getLineId, DEFAULT_EVENT_ID } from "../services/api";

function Queue() {
  const [queueData, setQueueData] = useState({
    queueCount: 0,
    queueNo: "-",
    name: "",
    room: "",
    status: "waiting",
  });

  const [loading, setLoading] = useState(true);

  const fetchQueue = async () => {
    try {
      const lineId = await getLineId();
      if (!lineId) {
        console.warn("no line id yet — skipping queue fetch");
        return;
      }
      const data = await apiGet(
        `/patients/${encodeURIComponent(lineId)}/queue-status?event_id=${DEFAULT_EVENT_ID}`
      );

      setQueueData({
        queueCount: data.ahead ?? data.total_waiting ?? 0,
        queueNo: data.queue_no ?? "-",
        name: data.name ?? "",
        room: data.room_name ?? "",
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