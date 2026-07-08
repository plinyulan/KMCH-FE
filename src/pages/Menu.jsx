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
          `/patients/${encodeURIComponent(lineId)}/check?event_id=${DEFAULT_EVENT_ID}`
        );
      } catch {
        if (!cancelled) setStatus("unregistered");
        return;
      }

      // Registered — check queue status to decide which page to show
      try {
        const qs = await apiGet(
          `/patients/${encodeURIComponent(lineId)}/queue-status?event_id=${DEFAULT_EVENT_ID}`
        );
        const s = qs?.status;
        if (!cancelled) {
          if (s === "waiting" || s === "assigned") setStatus("in-queue");
          else if (s === "completed") setStatus("completed");
          else setStatus("registered");
        }
      } catch {
        if (!cancelled) setStatus("registered");
      }
    })();

    return () => { cancelled = true; };
  }, []);

  return (
    <div className="menu-page">
      {status === "unregistered" && (
        <div className="menu-item">
          <img src={registerImg} alt="กรอกข้อมูล" />
          <button className="btn-orange" onClick={() => navigate("/register")}>
            กรอกข้อมูล
          </button>
        </div>
      )}

      {status === "registered" && (
        <div className="menu-item">
          <button
            className="btn-orange"
            onClick={async () => {
              const lineId = await getLineId();
              if (lineId) {
                try {
                  const route = await apiGet(
                    `/patients/${encodeURIComponent(lineId)}/route?event_id=${DEFAULT_EVENT_ID}`
                  );
                  if (route?.route_type) {
                    localStorage.setItem("backendRouteType", route.route_type);
                  }
                } catch { /* ignore — use cached value */ }
              }
              navigate("/state-path");
            }}
          >
            ดูเส้นทาง
          </button>
        </div>
      )}

      {status === "in-queue" && (
        <div className="menu-item">
          <button className="btn-orange" onClick={() => navigate("/queue")}>
            ดูสถานะคิว
          </button>
        </div>
      )}

      {status === "completed" && (
        <div className="menu-item">
          <button className="btn-orange" onClick={() => navigate("/finish")}>
            ดูผลการตรวจ
          </button>
        </div>
      )}
    </div>
  );
}

export default Menu;
