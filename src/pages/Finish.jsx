import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Finish.css";
import successImg from "../image/finish.png";
import { apiPost, getLineId, DEFAULT_EVENT_ID } from "../services/api";

function Finish() {
  const navigate = useNavigate();
  const ranRef = useRef(false);

  // Fire complete-doctor-consultation as soon as the user lands here, so the
  // DB status flips even if the Scanqrcode handler skipped the call. Guarded
  // by ranRef so React StrictMode's double-invoke doesn't fire it twice.
  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    (async () => {
      const lineId = await getLineId();
      if (!lineId) return;
      try {
        await apiPost(
          `/patients/${encodeURIComponent(lineId)}/complete-doctor-consultation`,
          { event_id: DEFAULT_EVENT_ID },
        );
      } catch (err) {
        // Already completed or not currently assigned → safe to ignore.
        console.warn("complete-doctor-consultation on /finish:", err?.message);
      }
      localStorage.removeItem("queueId");
    })();
  }, []);

  return (
    <div className="finish-page">
      <div className="finish-card">
        <img src={successImg} alt="success" className="finish-img" />

        <h1 className="finish-title">คุณได้ทำรายการสำเร็จแล้ว</h1>

        <h2 className="finish-next">สถานีต่อไปนี้คือ X-ray</h2>

      </div>
    </div>
  );
}

export default Finish;
