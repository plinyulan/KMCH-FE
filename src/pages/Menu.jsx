import "../App.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import registerImg from "../image/register.png";
import qr from "../image/qr.png";
import { apiGet, getLineId, DEFAULT_EVENT_ID } from "../services/api";


function Menu() {
  const navigate = useNavigate();
  // "checking" → hide register while we ask the backend
  // "unregistered" → show register button
  // "registered" → hide register button
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const lineId = await getLineId();
      if (!lineId) {
        if (!cancelled) setStatus("unregistered");
        return;
      }
      try {
        await apiGet(
          `/patients/${encodeURIComponent(lineId)}/route?event_id=${DEFAULT_EVENT_ID}`
        );
        if (!cancelled) setStatus("registered");
      } catch (err) {
        const msg = err?.message || "";
        if (/payment/i.test(msg)) {
          if (!cancelled) setStatus("registered");
        } else if (/not registered/i.test(msg)) {
          if (!cancelled) setStatus("unregistered");
        }
        // any other error → keep "checking" so the button stays hidden
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="menu-page">
      {status === "unregistered" && (
        <div className="menu-item">
          <img src={registerImg} alt="ลงทะเบียน" />
          <button className="btn-orange" onClick={() => navigate("/register")}>
            ลงทะเบียน
          </button>
        </div>
      )}

      <div className="menu-item">
        <img src={qr} alt="สแกน QR Code" />
        <button className="btn-blue" onClick={() => navigate("/scan-qr-code")}>
          สแกน QR Code
        </button>
      </div>
    </div>
  );
}

export default Menu;