import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Transferconfirm.css";
import { apiPost, getLineId, DEFAULT_EVENT_ID } from "../services/api";

function TransferConfirm() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  // After the user answers, call scan-after-payment so the backend marks them
  // paid and records needs_transfer in one shot. Idempotent — the backend
  // short-circuits if is_paid is already true.
  const answer = async (needsTransfer) => {
    if (submitting) return;
    setSubmitting(true);
    localStorage.setItem("transferConfirm", needsTransfer ? "true" : "false");
    try {
      const lineId = await getLineId();
      if (lineId) {
        await apiPost(
          `/patients/${encodeURIComponent(lineId)}/scan-after-payment`,
          { event_id: DEFAULT_EVENT_ID, needs_transfer: needsTransfer },
        );
      }
    } catch (err) {
      console.warn("scan-after-payment from /transfer-confirm:", err?.message);
      // continue anyway — better to keep the user moving forward than block them
    } finally {
      setSubmitting(false);
      navigate("/state-path");
    }
  };

  // ใช่ = transfer needed → TRANSFER (or MENTAL_TRANSFER) path
  // ไม่ = no transfer needed → NORMAL (or MENTAL) path
  const handleYes = () => answer(true);
  const handleNo = () => answer(false);

  return (
    <div className="transfer-confirm-page">
      <div className="transfer-confirm-card">
        <h1 className="transfer-confirm-title">คุณต้องการย้ายสิทธิหรือไม่</h1>

        <p className="transfer-confirm-desc">
          กรณีที่ไม่มั่นใจหรือไม่แน่ใจให้กดปุ่ม "ใช่"
          <br />
          เพื่อติดต่อเจ้าหน้าที่ในสถานีย้ายสิทธิ
        </p>

        <div className="transfer-confirm-buttons">
          <button
            className="transfer-confirm-btn yes"
            onClick={handleYes}
            disabled={submitting}
          >
            ใช่
          </button>

          <button
            className="transfer-confirm-btn no"
            onClick={handleNo}
            disabled={submitting}
          >
            ไม่
          </button>
        </div>
      </div>
    </div>
  );
}

export default TransferConfirm;
