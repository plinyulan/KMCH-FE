import { useState, useRef, useEffect } from "react";
import { apiPost, apiGet, DEFAULT_EVENT_ID } from "../services/api";
import "./ManualQueue.css";

function ManualQueue() {
  const [form, setForm] = useState({ firstName: "", lastName: "", patientId: "", lineId: "" });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // complete state inside result view
  const [completing, setCompleting] = useState(false);
  const [completeDone, setCompleteDone] = useState(false);
  const [completeError, setCompleteError] = useState(null);

  // search-to-complete section
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [lookupCompleting, setLookupCompleting] = useState(false);
  const [lookupMsg, setLookupMsg] = useState(null);
  const debounceRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, patientId } = form;
    if (!firstName.trim() || !lastName.trim() || !patientId.trim()) return;

    setSubmitting(true);
    setResult(null);
    setError(null);
    setCompleteDone(false);
    setCompleteError(null);

    try {
      const resp = await apiPost("/staff/manual-queue", {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        patient_id: patientId.trim(),
        event_id: DEFAULT_EVENT_ID,
        ...(form.lineId.trim() ? { line_id: form.lineId.trim() } : {}),
      });
      setResult(resp);
    } catch (err) {
      setError(err?.message || "เกิดข้อผิดพลาด");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm({ firstName: "", lastName: "", patientId: "", lineId: "" });
    setResult(null);
    setError(null);
    setCompleteDone(false);
    setCompleteError(null);
  };

  const handleComplete = async () => {
    const lineId = `manual-${form.patientId.trim()}`;
    setCompleting(true);
    setCompleteError(null);
    try {
      await apiPost(`/patients/${encodeURIComponent(lineId)}/complete-doctor-consultation`, {
        event_id: DEFAULT_EVENT_ID,
      });
      setCompleteDone(true);
    } catch (err) {
      setCompleteError(err?.message || "เกิดข้อผิดพลาด");
    } finally {
      setCompleting(false);
    }
  };

  // Search with debounce
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchText(val);
    setSelectedPatient(null);
    setLookupMsg(null);

    clearTimeout(debounceRef.current);
    if (!val.trim()) {
      setSearchResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await apiGet(`/staff/search?name=${encodeURIComponent(val.trim())}`);
        setSearchResults(Array.isArray(data) ? data : []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  };

  const handleSelectPatient = (p) => {
    setSelectedPatient(p);
    setSearchText(`${p.first_name} ${p.last_name}`);
    setSearchResults([]);
    setLookupMsg(null);
  };

  const handleLookupComplete = async () => {
    if (!selectedPatient) return;
    setLookupCompleting(true);
    setLookupMsg(null);
    try {
      await apiPost(
        `/patients/${encodeURIComponent(selectedPatient.line_id)}/complete-doctor-consultation`,
        { event_id: DEFAULT_EVENT_ID }
      );
      setLookupMsg({ ok: true, text: `เสร็จการพบแพทย์: ${selectedPatient.first_name} ${selectedPatient.last_name}` });
      setSelectedPatient(null);
      setSearchText("");
      setSearchResults([]);
    } catch (err) {
      setLookupMsg({ ok: false, text: err?.message || "เกิดข้อผิดพลาด" });
    } finally {
      setLookupCompleting(false);
    }
  };

  // ── Room toggle ──
  const [rooms, setRooms] = useState([]);
  const [toggling, setToggling] = useState(null);

  useEffect(() => {
    apiGet("/staff/rooms").then(setRooms).catch(() => {});
  }, []);

  const handleToggleRoom = async (roomId) => {
    setToggling(roomId);
    try {
      const updated = await apiPost(`/staff/rooms/${encodeURIComponent(roomId)}/toggle`, {});
      setRooms((prev) => prev.map((r) => r.room_id === updated.room_id ? updated : r));
    } catch { /* ignore */ } finally {
      setToggling(null);
    }
  };

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div className="mq-page">
      <div className="mq-wrap">

        {/* ── Add to queue ── */}
        <div className="mq-card">
          <h1 className="mq-title">เพิ่มคิวด้วยตนเอง</h1>
          <p className="mq-subtitle">สำหรับผู้ป่วยที่ไม่มีโทรศัพท์</p>

          {!result ? (
            <form className="mq-form" onSubmit={handleSubmit}>
              <div className="mq-row">
                <div className="mq-field">
                  <label className="mq-label">ชื่อ</label>
                  <input className="mq-input" type="text" placeholder="ชื่อ"
                    value={form.firstName} onChange={set("firstName")} autoFocus />
                </div>
                <div className="mq-field">
                  <label className="mq-label">นามสกุล</label>
                  <input className="mq-input" type="text" placeholder="นามสกุล"
                    value={form.lastName} onChange={set("lastName")} />
                </div>
              </div>
              <div className="mq-field">
                <label className="mq-label">เลขบัตรประชาชน หรือ Passport ID</label>
                <input className="mq-input" type="text"
                  placeholder="เลขบัตรปชช. 13 หลัก หรือ Passport"
                  value={form.patientId} onChange={set("patientId")} />
              </div>
              <div className="mq-field">
                <label className="mq-label">LINE ID (ถ้ามี)</label>
                <input className="mq-input" type="text" placeholder="Uxxxxxxxxxxxxxxxxx"
                  value={form.lineId} onChange={set("lineId")} autoComplete="off" />
              </div>
              {error && <p className="mq-error">{error}</p>}
              <button className="mq-btn" type="submit"
                disabled={submitting || !form.firstName.trim() || !form.lastName.trim() || !form.patientId.trim()}>
                {submitting ? "กำลังดำเนินการ..." : "เพิ่มเข้าคิว"}
              </button>
            </form>
          ) : (
            <div className="mq-result">
              <div className="mq-result-icon">✓</div>
              <p className="mq-result-name">{result.first_name} {result.last_name}</p>
              <p className="mq-result-msg">{result.message}</p>
              {result.room_name && <p className="mq-result-room">ห้อง: {result.room_name}</p>}

              {!completeDone ? (
                <div className="mq-complete-section">
                  <button className="mq-btn mq-btn-green" onClick={handleComplete} disabled={completing}>
                    {completing ? "กำลังบันทึก..." : "✓ เสร็จการพบแพทย์"}
                  </button>
                  {completeError && <p className="mq-error">{completeError}</p>}
                </div>
              ) : (
                <div className="mq-complete-done">เสร็จสิ้นการพบแพทย์แล้ว</div>
              )}

              <button className="mq-btn mq-btn-outline" onClick={handleReset}>
                เพิ่มผู้ป่วยคนถัดไป
              </button>
            </div>
          )}
        </div>

        {/* ── Search to complete ── */}
        <div className="mq-card mq-card-secondary">
          <h2 className="mq-title mq-title-sm">กดเสร็จการพบแพทย์</h2>
          <p className="mq-subtitle">ค้นหาชื่อผู้ป่วยที่อยู่ในห้องแพทย์</p>

          <div className="mq-search-wrap">
            <input
              className="mq-input"
              type="text"
              placeholder="พิมพ์ชื่อหรือนามสกุล..."
              value={searchText}
              onChange={handleSearchChange}
              autoComplete="off"
            />

            {/* Dropdown results */}
            {(searchResults.length > 0 || searching) && (
              <div className="mq-dropdown">
                {searching && <div className="mq-dropdown-item mq-dropdown-loading">กำลังค้นหา...</div>}
                {!searching && searchResults.map((p) => (
                  <button
                    key={p.line_id}
                    className="mq-dropdown-item"
                    type="button"
                    onClick={() => handleSelectPatient(p)}
                  >
                    <span className="mq-dropdown-name">{p.first_name} {p.last_name}</span>
                    <span className="mq-dropdown-room">{p.room_name}</span>
                  </button>
                ))}
                {!searching && searchResults.length === 0 && (
                  <div className="mq-dropdown-item mq-dropdown-empty">ไม่พบผู้ป่วย</div>
                )}
              </div>
            )}
          </div>

          {selectedPatient && (
            <div className="mq-selected-info">
              <span>{selectedPatient.first_name} {selectedPatient.last_name}</span>
              <span className="mq-selected-room">{selectedPatient.room_name}</span>
            </div>
          )}

          {lookupMsg && (
            <p className={lookupMsg.ok ? "mq-success" : "mq-error"} style={{ marginTop: 10 }}>
              {lookupMsg.text}
            </p>
          )}

          <button
            className="mq-btn mq-btn-green"
            onClick={handleLookupComplete}
            disabled={lookupCompleting || !selectedPatient}
            style={{ marginTop: 14 }}
          >
            {lookupCompleting ? "กำลังบันทึก..." : "✓ เสร็จการพบแพทย์"}
          </button>
        </div>

      </div>

      {/* ── Room toggle ── */}
      {rooms.length > 0 && (
        <div className="mq-card mq-card-secondary">
          <h2 className="mq-title mq-title-sm">เปิด/ปิดห้องแพทย์</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
            {rooms.map((r) => (
              <div key={r.room_id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 600 }}>{r.room_name}</span>
                <button
                  className={r.is_active ? "mq-btn mq-btn-outline" : "mq-btn mq-btn-green"}
                  style={{ width: 100, marginTop: 0 }}
                  disabled={toggling === r.room_id}
                  onClick={() => handleToggleRoom(r.room_id)}
                >
                  {toggling === r.room_id ? "..." : r.is_active ? "ปิดห้อง" : "เปิดห้อง"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default ManualQueue;
