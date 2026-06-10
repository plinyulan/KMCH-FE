import "../App.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import registerImg from "../image/register.png";
import qr from "../image/qr.png";
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
            lineId,
          )}/route?event_id=${DEFAULT_EVENT_ID}`,
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
          <img src={registerImg} alt="ลงทะเบียน" />
          <button className="btn-orange" onClick={() => navigate("/register")}>
            ลงทะเบียน
          </button>
        </div>
      )}

      <div className="menu-item qr-guide-item">
        <img src={qr} alt="QR Code" className="qr-guide-image" />

        <div className="qr-guide-box">
          <div className="qr-guide-box">
            <h2>วิธีสแกน QR Code</h2>

            <p>
              กรุณาสแกน QR Code ผ่านแอป LINE โดยแตะปุ่ม
              <strong> เพิ่มเพื่อน (รูปคนพร้อมเครื่องหมาย +)</strong>
              บริเวณมุมบนขวาของหน้า “หน้าหลัก” จากนั้นเลือกเมนู{" "}
              <strong>QR Code</strong>
              และนำกล้องไปสแกนที่จุดให้บริการ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Menu;
