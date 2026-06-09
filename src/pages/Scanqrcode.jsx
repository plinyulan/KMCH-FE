import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import liff from "@line/liff";
import "./Scanqrcode.css";
import { apiPost, getLineId, DEFAULT_EVENT_ID } from "../services/api";

function Scanqrcode() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [scanValue, setScanValue] = useState("");
  const [liffReady, setLiffReady] = useState(false);
  const [debugText, setDebugText] = useState("");

  useEffect(() => {
    // Surface state immediately so we can see what's going on even before
    // liff.ready resolves.
    const baseInfo = () =>
      `LIFF_ID: ${import.meta.env.VITE_LIFF_ID || "(empty)"}\n` +
      `URL: ${window.location.href}\n` +
      `liff loaded: ${typeof liff === "object"}\n` +
      `liff.ready: ${liff.ready ? "exists" : "missing"}`;

    setDebugText(`waiting for LIFF...\n${baseInfo()}`);

    const onReady = () => {
      // const info =
      //   `LIFF READY\n` +
      //   baseInfo() +
      //   `\nisInClient: ${liff.isInClient?.() ?? "unknown"}` +
      //   `\nscanCodeV2 available: ${liff.isApiAvailable?.("scanCodeV2") ?? "unknown"}`;
      const info = ``;
      // console.log(info);
      setDebugText(info);
      setLiffReady(true);
    };

    if (liff?.ready) {
      liff.ready.then(onReady).catch((err) => {
        const msg =
          `LIFF init failed\n` +
          baseInfo() +
          `\nmessage: ${err?.message || "no message"}` +
          `\ncode: ${err?.code || "no code"}`;
        console.error(msg);
        setDebugText(msg);
      });
    } else {
      // No liff.ready at all — init was never called.
      setDebugText(`LIFF.ready missing — init not called\n${baseInfo()}`);
    }
  }, []);

  const callBackend = async (action) => {
    const lineId = await getLineId();
    if (!lineId) throw new Error("ยังไม่มี LINE ID — กรุณาลงทะเบียนก่อน");

    const base = `/patients/${encodeURIComponent(lineId)}`;
    const eventBody = { event_id: DEFAULT_EVENT_ID };

    if (action === "scan_after_payment") {
      const needsTransfer = localStorage.getItem("transferConfirm") === "true";
      return apiPost(`${base}/scan-after-payment`, {
        ...eventBody,
        needs_transfer: needsTransfer,
      });
    }
    if (action === "join_doctor_queue") {
      return apiPost(`${base}/scan-doctor-queue`, eventBody);
    }
    if (action === "complete_consultation") {
      return apiPost(`${base}/complete-doctor-consultation`, eventBody);
    }
    return null;
  };

  const handleScanQR = async () => {
    try {
      setLoading(true);

      let qrValue = "";

      const isLineClient = liff.isInClient();
      const canScan = liff.isApiAvailable("scanCodeV2");

      console.log("isInClient:", isLineClient);
      console.log("scanCodeV2:", canScan);

      if (!isLineClient) {
        const mockQR = window.prompt(
          "ตอนนี้ไม่ได้เปิดใน LINE\nใส่ค่า QR เพื่อทดสอบ\n\nตัวอย่าง:\nROUTE:XRAY\nQUEUE:REGIS_01\nCHECKOUT:REGIS_01\nDOCTOR:DOCTOR_01",
          "QUEUE:REGIS_01",
        );

        if (!mockQR) return;

        qrValue = mockQR;
      } else {
        if (!canScan) {
          alert(
            "LIFF นี้ยังใช้ scanCodeV2 ไม่ได้\n\nให้เช็กใน LINE Developers:\n1. Size ต้องเป็น Full\n2. Scan QR ต้องเป็น ON",
          );
          return;
        }

        const result = await liff.scanCodeV2();

        if (!result || !result.value) {
          alert("ไม่พบข้อมูลจาก QR Code");
          return;
        }

        qrValue = result.value;
      }

      setScanValue(qrValue);
      console.log("QR VALUE:", qrValue);

      // กรณี QR เป็น URL เช่น https://q.me-qr.com/xxxx
      if (qrValue.startsWith("http://") || qrValue.startsWith("https://")) {
        // แบบที่ 1: ให้เปิด URL ที่สแกนได้
        window.location.href = qrValue;

        // ถ้าหนูอยากให้ URL พาไปหน้าเส้นทางแทน ให้ใช้บรรทัดนี้แทน
        // navigate("/state-path");

        return;
      }

      const parts = qrValue.split(":");

      if (parts.length < 2) {
        alert(`QR Code ไม่ถูกต้อง\n\nค่าที่อ่านได้: ${qrValue}`);
        return;
      }

      const type = parts[0];
      const value = parts[1];

      if (type === "ROUTE") {
        alert(`กำลังเปิดเส้นทางไป ${value}`);
        navigate(`/state-path?station=${value}`);
        return;
      }

      if (type === "QUEUE") {
        await callBackend("join_doctor_queue");
        alert("รับคิวเรียบร้อยแล้ว");
        navigate("/queue");
        return;
      }

      if (type === "CHECKOUT") {
        // Just route to the transfer-confirm question. The page will call
        // scan-after-payment with the user's answer in one POST.
        navigate("/transfer-confirm");
        return;
      }

      if (type === "DOCTOR") {
        try {
          await callBackend("complete_consultation");
        } catch (err) {
          // Backend rejected because the user isn't actually in a doctor room
          // yet ("no active queue entry" / "patient is not currently assigned
          // to a room"). Surface the dedicated warning page.
          console.warn("complete_consultation rejected:", err?.message);
          navigate("/queue", { state: { fromDoctorScan: true } });
          return;
        }
        alert("จบการพบแพทย์ ไปสถานีถัดไป");
        navigate("/finish");
        return;
      }

      alert(`QR Code ไม่ถูกต้อง\n\nค่าที่อ่านได้: ${qrValue}`);
    } catch (err) {
      console.error("Scan error:", err);

      alert(
        `สแกนไม่สำเร็จ\n\nmessage: ${
          err?.message || "no message"
        }\ncode: ${err?.code || "no code"}`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="queue-page">
      <div className="queue-card">
        <h1 className="queue-title">สแกน QR Code</h1>

        <p className="queue-desc">
          กรุณาสแกน QR Code ที่จุดบริการ
          <br />
          เพื่อรับคิว ออกจากคิว
          <br />
          ดูเส้นทาง หรือไปพบแพทย์
        </p>

        <div className="qr-box">
          <div className="qr-icon">▣</div>
          <p>
            แตะปุ่มด้านล่าง
            <br />
            เพื่อเปิดกล้อง
          </p>
        </div>

        {scanValue && <p className="scan-result">QR: {scanValue}</p>}

        <button
          className="scan-btn"
          onClick={handleScanQR}
          disabled={loading || !liffReady}
        >
          {loading ? "กำลังสแกน..." : "สแกน QR Code"}
        </button>

        <button className="back-btn" onClick={() => navigate("/")}>
          กลับหน้าเมนู
        </button>

        <pre className="debug-box">{debugText}</pre>
      </div>
    </div>
  );
}

export default Scanqrcode;
