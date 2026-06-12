import "../App.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import registerImg from "../image/register.png";
import { apiGet, getLineId, DEFAULT_EVENT_ID } from "../services/api";

function Menu() {
  const navigate = useNavigate();
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
          `/patients/${encodeURIComponent(
            lineId
          )}/route?event_id=${DEFAULT_EVENT_ID}`
        );

        if (!cancelled) setStatus("registered");
      } catch (err) {
        const msg = err?.message || "";

        if (/payment/i.test(msg)) {
          if (!cancelled) setStatus("registered");
        } else if (/not registered/i.test(msg)) {
          if (!cancelled) setStatus("unregistered");
        }
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
          <img src={registerImg} alt="กรอกข้อมูล" />

          <button
            className="btn-orange"
            onClick={() => navigate("/register")}
          >
            กรอกข้อมูล
          </button>
        </div>
      )}
    </div>
  );
}

export default Menu;
