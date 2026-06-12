import { useState } from "react";
import { apiPost, DEFAULT_EVENT_ID } from "../services/api";
import "./ManualQueue.css";

function ManualQueue() {
  const [form, setForm] = useState({ firstName: "", lastName: "", patientId: "" });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, patientId } = form;
    if (!firstName.trim() || !lastName.trim() || !patientId.trim()) return;

    setSubmitting(true);
    setResult(null);
    setError(null);

    try {
      const resp = await apiPost("/staff/manual-queue", {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        patient_id: patientId.trim(),
        event_id: DEFAULT_EVENT_ID,
      });
      setResult(resp);
    } catch (err) {
      setError(err?.message || "เกิดข้อผิดพลาด");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm({ firstName: "", lastName: "", patientId: "" });
    setResult(null);
    setError(null);
  };

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div className="mq-page">
      <div className="mq-card">
        <h1 className="mq-title">เพิ่มคิวด้วยตนเอง</h1>
        <p className="mq-subtitle">สำหรับผู้ป่วยที่ไม่มีโทรศัพท์</p>

        {!result ? (
          <form className="mq-form" onSubmit={handleSubmit}>
            <div className="mq-row">
              <div className="mq-field">
                <label className="mq-label">ชื่อ</label>
                <input
                  className="mq-input"
                  type="text"
                  placeholder="ชื่อ"
                  value={form.firstName}
                  onChange={set("firstName")}
                  autoFocus
                />
              </div>
              <div className="mq-field">
                <label className="mq-label">นามสกุล</label>
                <input
                  className="mq-input"
                  type="text"
                  placeholder="นามสกุล"
                  value={form.lastName}
                  onChange={set("lastName")}
                />
              </div>
            </div>

            <div className="mq-field">
              <label className="mq-label">เลขบัตรประชาชน หรือ Passport ID</label>
              <input
                className="mq-input"
                type="text"
                placeholder="เลขบัตรปชช. 13 หลัก หรือ Passport"
                value={form.patientId}
                onChange={set("patientId")}
              />
            </div>

            {error && <p className="mq-error">{error}</p>}

            <button
              className="mq-btn"
              type="submit"
              disabled={submitting || !form.firstName.trim() || !form.lastName.trim() || !form.patientId.trim()}
            >
              {submitting ? "กำลังดำเนินการ..." : "เพิ่มเข้าคิว"}
            </button>
          </form>
        ) : (
          <div className="mq-result">
            <div className="mq-result-icon">✓</div>
            <p className="mq-result-name">{result.first_name} {result.last_name}</p>
            <p className="mq-result-msg">{result.message}</p>
            {result.room_name && (
              <p className="mq-result-room">ห้อง: {result.room_name}</p>
            )}
            <button className="mq-btn mq-btn-outline" onClick={handleReset}>
              เพิ่มผู้ป่วยคนถัดไป
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManualQueue;
