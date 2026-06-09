import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import liff from "@line/liff";
import "./Scanqrcode.css";

function Scanqrcode() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [scanValue, setScanValue] = useState("");
  const [liffReady, setLiffReady] = useState(false);
  const [debugText, setDebugText] = useState("");

  useEffect(() => {
    const initLiff = async () => {
      try {
        setDebugText("กำลังเริ่มต้น LIFF...");

        await liff.init({
          liffId: "2010319350-6qXV1rha",
        });

        const info = `
LIFF INIT SUCCESS
URL: ${window.location.href}
isInClient: ${liff.isInClient()}
scanCodeV2: ${liff.isApiAvailable("scanCodeV2")}
`;

        console.log(info);
        setDebugText(info);
        setLiffReady(true);
      } catch (err) {
        console.error("LIFF ERROR:", err);

        const errorMessage = `
LIFF INIT ERROR

message: ${err?.message || "no message"}
code: ${err?.code || "no code"}

url: ${window.location.href}
`;

        setDebugText(errorMessage);
        alert(errorMessage);
      }
    };

    initLiff();
  }, []);

  const updateQueue = async (data) => {
    console.log("ส่งข้อมูลไปหลังบ้าน:", data);

    // ใช้ตอนยังไม่มี backend จริง
    return true;
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
          "ตอนนี้ไม่ได้เปิดใน LINE\nใส่ค่า QR เพื่อทดสอบ\n\nตัวอย่าง:\nROUTE:XRAY\nQUEUE:REGIS_01\nCHECKOUT:REGIS_01\nDOCTOR:DOCTOR_01\nhttps://q.me-qr.com/dz84y86y",
          "https://q.me-qr.com/dz84y86y"
        );

        if (!mockQR) return;

        qrValue = mockQR;
      } else {
        if (!canScan) {
          alert(
            "LIFF นี้ยังใช้ scanCodeV2 ไม่ได้\n\nให้เช็กใน LINE Developers:\n1. Size ต้องเป็น Full\n2. Scan QR ต้องเป็น ON"
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
      if (
        qrValue.startsWith("http://") ||
        qrValue.startsWith("https://")
      ) {
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
        await updateQueue({
          stationId: value,
          action: "join_queue",
          status: "waiting",
        });

        alert("รับคิวเรียบร้อยแล้ว");
        navigate("/queue");
        return;
      }

      if (type === "CHECKOUT") {
        await updateQueue({
          stationId: value,
          action: "leave_queue",
          status: "completed",
        });

        alert("ออกจากคิวเรียบร้อยแล้ว");
        navigate("/");
        return;
      }

      if (type === "DOCTOR") {
        await updateQueue({
          stationId: value,
          action: "go_doctor",
          status: "waiting_doctor",
        });

        alert("ส่งไปพบแพทย์เรียบร้อยแล้ว");
        navigate("/wait");
        return;
      }

      alert(`QR Code ไม่ถูกต้อง\n\nค่าที่อ่านได้: ${qrValue}`);
    } catch (err) {
      console.error("Scan error:", err);

      alert(
        `สแกนไม่สำเร็จ\n\nmessage: ${
          err?.message || "no message"
        }\ncode: ${err?.code || "no code"}`
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