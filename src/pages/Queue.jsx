import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Queue.css";
import image from "../image/queue.png";
import { apiGet, apiPost, getLineId, DEFAULT_EVENT_ID } from "../services/api";

const POLL_INTERVAL_MS = 5_000;

function Queue() {
  const navigate = useNavigate();
  const location = useLocation();
  // Flag set by Scanqrcode when the user scanned the "complete consultation"
  // QR before actually being seen by a doctor.
  const fromDoctorScan = location.state?.fromDoctorScan === true;

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [ready, setReady] = useState(false);
  const joinTriedRef = useRef(false);

  const fetchQueue = async () => {
    try {
      const lineId = await getLineId();
      if (!lineId) {
        setError("ยังไม่พบ LINE ID");
        setReady(true);
        return;
      }
      const resp = await apiGet(
        `/patients/${encodeURIComponent(lineId)}/queue-status?event_id=${DEFAULT_EVENT_ID}`,
      );

      // Auto-join queue if not yet in it
      if (
        (resp?.status === "not_in_queue" || resp?.status === "pending") &&
        !fromDoctorScan &&
        !joinTriedRef.current
      ) {
        joinTriedRef.current = true;
        try {
          await apiPost(
            `/patients/${encodeURIComponent(lineId)}/scan-doctor-queue`,
            { event_id: DEFAULT_EVENT_ID },
          );
          const after = await apiGet(
            `/patients/${encodeURIComponent(lineId)}/queue-status?event_id=${DEFAULT_EVENT_ID}`,
          );
          setData(after);
          setError(null);
          setReady(true);
          return;
        } catch (joinErr) {
          console.warn("auto-join failed:", joinErr?.message);
        }
      }

      setData(resp);
      setError(null);
      setReady(true);
    } catch (err) {
      setError(err?.message || "โหลดข้อมูลคิวไม่สำเร็จ");
      setReady(true);
    }
  };

  useEffect(() => {
    fetchQueue();
    const id = setInterval(fetchQueue, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  // Hide the entire page until the first fetch resolves so the user doesn't
  // see a flash of the loading state before the real content lands.
  if (!ready) return null;

  // navigate stays imported in case we add a redirect later; suppress unused
  // warning while not in use.
  void navigate;

  return (
    <div className="queue-page">
      <div className="queue-card">
        <div className="queue-icon">
          <img src={image} alt="Queue" className="queue-success-image" />
        </div>
        {error ? (
          <p className="queue-count">{error}</p>
        ) : (
          <StatusView data={data} fromDoctorScan={fromDoctorScan} />
        )}
      </div>
    </div>
  );
}

function StatusView({ data, fromDoctorScan }) {
  const status = data?.status;

  // Only show this warning when the user scanned the DOCTOR (complete) QR
  // before actually being seen by a doctor — not for any plain visit.
  if (fromDoctorScan && status !== "completed") {
    return (
      <>
        <h1 className="queue-main-title">คุณยังไม่ได้เข้าคิวพบแพทย์</h1>
        <p className="queue-count">
          กรุณารอเรียกคิวและพบแพทย์ก่อนสแกน QR Code เสร็จสิ้น
        </p>
      </>
    );
  }

  if (status === "not_in_queue") {
    return (
      <>
        <h1 className="queue-main-title">ยังไม่ได้เข้าคิว</h1>
        <p className="queue-count">
          กรุณาสแกน QR Code ที่จุดบริการเพื่อรับคิวพบแพทย์
        </p>
      </>
    );
  }

  if (status === "pending") {
    return (
      <>
        <h1 className="queue-main-title">กำลังเข้าสู่ระบบคิว...</h1>
        <p className="queue-count">กรุณารอสักครู่</p>
      </>
    );
  }

  if (status === "waiting") {
    return (
      <>
        <h1 className="queue-main-title">คุณได้เข้าสู่ระบบคิวเรียบร้อยแล้ว</h1>
        <p className="queue-count">ไปวัดความดันก่อนเข้าพบแพทย์</p>
        <p className="queue-count">
          ตอนนี้คิวที่รออยู่ก่อนหน้า: <span>{data.ahead ?? 0}</span> คิว
        </p>
        {typeof data.total_waiting === "number" && (
          <p className="queue-count">
            จำนวนคิวทั้งหมด: <span>{data.total_waiting}</span> คิว
          </p>
        )}
      </>
    );
  }

  if (status === "assigned") {
    return (
      <>
        <h1 className="queue-main-title">ถึงคิวคุณแล้ว</h1>
        <p className="queue-count">กรุณาไปที่ห้องตรวจ</p>
        <div className="queue-info-box">
          <p className="queue-room-text">
            ห้องที่รับบริการคือ {data.room_name || "-"}
          </p>
        </div>
      </>
    );
  }

  if (status === "completed") {
    return (
      <>
        <h1 className="queue-main-title">พบแพทย์เรียบร้อยแล้ว</h1>
        <p className="queue-count">
          กรุณาไปสถานีถัดไป
          {data.next_station ? `: ${data.next_station}` : ""}
        </p>
      </>
    );
  }

  if (status === "skip") {
    return (
      <>
        <h1 className="queue-main-title">คิวของคุณถูกข้าม</h1>
        <p className="queue-count">กรุณาติดต่อเจ้าหน้าที่</p>
      </>
    );
  }

  return (
    <>
      <h1 className="queue-main-title">สถานะคิว</h1>
      <p className="queue-count">{data?.message || "ไม่ทราบสถานะ"}</p>
    </>
  );
}

export default Queue;
