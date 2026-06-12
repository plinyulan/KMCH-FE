import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiPost, getLineId, DEFAULT_EVENT_ID } from "../services/api";

function CompleteDoctor() {
  const navigate = useNavigate();
  const ranRef = useRef(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    (async () => {
      try {
        const lineId = await getLineId();
        if (!lineId) { setError("ไม่พบ LINE ID กรุณาเปิดผ่าน LINE"); return; }

        await apiPost(
          `/patients/${encodeURIComponent(lineId)}/complete-doctor-consultation`,
          { event_id: DEFAULT_EVENT_ID },
        );
        navigate("/queue", { state: { fromDoctorScan: true } });
      } catch (err) {
        const msg = err?.message || "";
        if (msg.toLowerCase().includes("not currently assigned")) {
          setError("คุณยังไม่ได้รับการเรียกคิวพบแพทย์");
        } else {
          setError(msg || "เกิดข้อผิดพลาด");
        }
      }
    })();
  }, [navigate]);

  if (error) {
    return (
      <div style={{ padding: 32, textAlign: "center", fontFamily: "sans-serif" }}>
        <p style={{ color: "#e53e3e", fontSize: 18 }}>{error}</p>
      </div>
    );
  }

  return null;
}

export default CompleteDoctor;
