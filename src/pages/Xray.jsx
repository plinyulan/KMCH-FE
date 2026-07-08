import { useEffect, useRef } from "react";
import { apiPost, getLineId, DEFAULT_EVENT_ID } from "../services/api";
import "./Xray.css";
import successImg from "../image/final.png";

function Xray() {
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    (async () => {
      try {
        const lineId = await getLineId();
        await apiPost(
          `/patients/${encodeURIComponent(lineId)}/complete-xray`,
          { event_id: DEFAULT_EVENT_ID },
        );
      } catch {
        // already completed or not yet assigned — safe to ignore
      }
    })();
  }, []);

  return (
    <div className="xray-page">
      <div className="xray-card">
        <div className="xray-icon">
          <img
            src={successImg}
            alt="Success"
            className="xray-success-image"
          />
        </div>

        <h1 className="xray-main-title">
          คุณเข้ารับบริการ
          <br />
          ครบทุกสถานีแล้ว
        </h1>

      </div>
    </div>
  );
}

export default Xray;
