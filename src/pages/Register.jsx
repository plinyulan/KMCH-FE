import { useState } from "react";

function isValidThaiID(id) {
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(id[i]) * (13 - i);
  }
  const check = (11 - (sum % 11)) % 10;
  return check === parseInt(id[12]);
}
import { useNavigate } from "react-router-dom";
import "./Register.css";
import { apiGet, apiPost, getLineId, setLineId, DEFAULT_EVENT_ID } from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    citizenId: "",
    passportId: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [walkInMessage, setWalkInMessage] = useState(null);
  const [pendingLineId, setPendingLineId] = useState(null);

  const proceedAfterRegister = async (lineId) => {
    // Auto-process payment and determine route
    try {
      const resp = await apiPost(`/patients/${encodeURIComponent(lineId)}/scan-after-payment`, {
        event_id: DEFAULT_EVENT_ID,
      });
      if (resp?.route_type) {
        localStorage.setItem("backendRouteType", resp.route_type);
      }
    } catch (err) {
      const msg = (err?.message || "").toLowerCase();
      // "already" means it was processed before — still continue
      if (!msg.includes("already")) {
        // non-fatal, continue anyway
      }
    }

    // Check if mental health screening was completed
    let psyevalForm = false;
    try {
      const check = await apiGet(
        `/patients/${encodeURIComponent(lineId)}/check?event_id=${DEFAULT_EVENT_ID}`
      );
      psyevalForm = check?.psyeval_form === true;
    } catch {
      // safe default: show warning
    }

    const mentalDone = localStorage.getItem("mentalTestDone") === "true";
    navigate(psyevalForm || mentalDone ? "/register-success" : "/mental-test-warning");
  };

  const continueAfterWalkIn = async () => {
    setWalkInMessage(null);
    const lineId = pendingLineId || await getLineId();
    await proceedAfterRegister(lineId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    const hasNationalId = form.citizenId.trim() !== "";
    const hasPassportId = form.passportId.trim() !== "";

    if (!form.firstName.trim()) {
      newErrors.firstName = "Please enter your First Name(English only)";
    }

    if (!form.lastName.trim()) {
      newErrors.lastName = "Please enter your Last Name (English only)";
    }

    if (!hasNationalId && !hasPassportId) {
      newErrors.id = "Please enter your National ID or Passport Number";
    }

    if (hasNationalId && hasPassportId) {
      newErrors.id = "Please enter only one of the IDs";
    }

    if (hasNationalId) {
      if (!/^\d{13}$/.test(form.citizenId)) {
        newErrors.citizenId = "National ID must contain exactly 13 digits";
      } else if (!isValidThaiID(form.citizenId)) {
        newErrors.citizenId = "เลขบัตรประชาชนไม่ถูกต้อง";
      }
    }

    if (hasPassportId && !/^[A-Za-z0-9]{6,9}$/.test(form.passportId)) {
      newErrors.passportId = "Passport ID must contain 6-9 characters";
    }

    if (form.phone.trim() !== "" && !/^\d{10}$/.test(form.phone)) {
      newErrors.phone = "Phone Number must contain exactly 10 digits";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length !== 0) return;

    const idValue = hasNationalId ? form.citizenId : form.passportId;

    let lineId = await getLineId();
    if (!lineId) {
      lineId = `dev-${idValue}`;
      setLineId(lineId);
    }

    const body = {
      line_id: lineId,
      first_name: form.firstName.trim(),
      last_name: form.lastName.trim(),
      tel_no: form.phone.trim(),
      event_id: DEFAULT_EVENT_ID,
      ...(hasNationalId
        ? { national_id: form.citizenId.trim() }
        : { passport_id: form.passportId.trim() }),
    };

    let resp;
    try {
      setSubmitting(true);
      resp = await apiPost("/register", body);
      localStorage.setItem("registerResponse", JSON.stringify(resp));
    } catch (err) {
      setErrors({ submit: err.message || "ลงทะเบียนไม่สำเร็จ" });
      return;
    } finally {
      setSubmitting(false);
    }

    // Walk-in: show message, user taps continue then we proceed
    if (resp?.walk_in) {
      setPendingLineId(lineId);
      setWalkInMessage(resp.message);
      return;
    }

    await proceedAfterRegister(lineId);
  };

  if (walkInMessage) {
    return (
      <div className="register-page">
        <div className="register-form" style={{ textAlign: "center", gap: 24 }}>
          <p style={{ fontSize: 20, fontWeight: "bold", color: "#e53e3e" }}>
            {walkInMessage}
          </p>
          <button type="button" onClick={continueAfterWalkIn}>
            ดำเนินการต่อ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="register-page">
      <h1 className="register-title">Register</h1>

      <form
        className="register-form"
        onSubmit={handleSubmit}
      >
        {/* First Name */}
        <div>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={(e) =>
              setForm({
                ...form,
                firstName: e.target.value,
              })
            }
          />
          {errors.firstName && (
            <p>{errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={(e) =>
              setForm({
                ...form,
                lastName: e.target.value,
              })
            }
          />
          {errors.lastName && (
            <p>{errors.lastName}</p>
          )}
        </div>

        {/* National ID */}
        <div>
          <input
            type="text"
            name="citizenId"
            placeholder="National ID (for Thai Students)"
            value={form.citizenId}
            onChange={(e) => {
              const onlyNumber = e.target.value.replace(/\D/g, "");
              setForm({ ...form, citizenId: onlyNumber.slice(0, 13) });
            }}
          />
          {errors.citizenId && <p>{errors.citizenId}</p>}
        </div>

        {/* Passport ID */}
        <div>
          <input
            type="text"
            name="passportId"
            placeholder="Passport ID (for Foreign Students)"
            value={form.passportId}
            onChange={(e) => {
              const value = e.target.value.replace(/[^A-Za-z0-9]/g, "");
              setForm({ ...form, passportId: value.slice(0, 9) });
            }}
          />
          {errors.passportId && <p>{errors.passportId}</p>}
          {errors.id && <p>{errors.id}</p>}
        </div>

        {/* Phone Number Optional */}
        <div>
          <input
            type="text"
            name="phone"
            placeholder="Phone Number (Optional)"
            value={form.phone}
            onChange={(e) => {
              const onlyNumber = e.target.value.replace(/\D/g, "");
              setForm({ ...form, phone: onlyNumber.slice(0, 10) });
            }}
          />
          {errors.phone && <p>{errors.phone}</p>}
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Complete"}
        </button>

        {errors.submit && <p>{errors.submit}</p>}
      </form>
    </div>
  );
}

export default Register;
