import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import {
  apiGet,
  apiPost,
  getLineId,
  setLineId,
  DEFAULT_EVENT_ID,
} from "../services/api";

function isValidThaiID(id) {
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(id[i]) * (13 - i);
  }
  const check = (11 - (sum % 11)) % 10;
  return check === parseInt(id[12]);
}

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
  const [checking, setChecking] = useState(true);

  // On mount: if already registered, redirect based on current status
  useEffect(() => {
    // Fallback: show form after 5s if async check hangs (e.g. LIFF slow)
    const fallback = setTimeout(() => setChecking(false), 5000);
    (async () => {
      try {
        const lineId = await getLineId();
        if (lineId) {
          const check = await apiGet(
            `/patients/${encodeURIComponent(lineId)}/check?event_id=${DEFAULT_EVENT_ID}`
          );
          if (check?.line_id) {
            clearTimeout(fallback);
            try {
              const qs = await apiGet(
                `/patients/${encodeURIComponent(lineId)}/queue-status?event_id=${DEFAULT_EVENT_ID}`
              );
              const status = qs?.status;
              if (status === "waiting" || status === "assigned") {
                navigate("/queue", { replace: true });
                return;
              }
              if (status === "completed") {
                navigate("/finish", { replace: true });
                return;
              }
            } catch {
              // ignore
            }
            navigate("/state-path", { replace: true });
            return;
          }
        }
      } catch {
        // not registered or network error — show form
      }
      clearTimeout(fallback);
      setChecking(false);
    })();
    return () => clearTimeout(fallback);
  }, [navigate]);


  const proceedAfterRegister = async (lineId) => {
    try {
      const resp = await apiPost(
        `/patients/${encodeURIComponent(lineId)}/scan-after-payment`,
        { event_id: DEFAULT_EVENT_ID }
      );
      if (resp?.route_type) {
        localStorage.setItem("backendRouteType", resp.route_type);
      }
    } catch {}

    let psyevalForm = false;
    try {
      const check = await apiGet(
        `/patients/${encodeURIComponent(lineId)}/check?event_id=${DEFAULT_EVENT_ID}`
      );
      psyevalForm = check?.psyeval_form === true;
    } catch {}

    const mentalDone = localStorage.getItem("mentalTestDone") === "true";
    navigate(
      psyevalForm || mentalDone ? "/register-success" : "/mental-test-warning",
      { replace: true }
    );
  };

  const continueAfterWalkIn = async () => {
    setWalkInMessage(null);
    await proceedAfterRegister(pendingLineId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    const hasNationalId = form.citizenId.trim() !== "";
    const hasPassportId = form.passportId.trim() !== "";

    if (!form.firstName.trim()) {
      newErrors.firstName = "Please enter your First Name";
    }

    if (!form.lastName.trim()) {
      newErrors.lastName = "Please enter your Surname";
    }

    if (!hasNationalId && !hasPassportId) {
      newErrors.id =
        "Please fill in either National ID for Thai students or Passport ID for foreign students";
    }

    if (hasNationalId && hasPassportId) {
      newErrors.id = "Please fill in only one ID type";
    }

    if (hasNationalId) {
      if (!/^\d{13}$/.test(form.citizenId)) {
        newErrors.citizenId = "National ID must be exactly 13 digits";
      } else if (!isValidThaiID(form.citizenId)) {
        newErrors.citizenId = "Invalid National ID";
      }
    }

    if (hasPassportId && !/^[A-Za-z0-9]{6,9}$/.test(form.passportId)) {
      newErrors.passportId = "Passport ID must be 6-9 letters or numbers";
    }

    if (form.phone.trim() !== "" && !/^\d{10}$/.test(form.phone)) {
      newErrors.phone = "Phone Number must be exactly 10 digits";
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
      setErrors({ submit: err.message || "Registration failed" });
      return;
    } finally {
      setSubmitting(false);
    }

    if (resp?.walk_in) {
      setPendingLineId(lineId);
      setWalkInMessage(resp.message);
      return;
    }

    await proceedAfterRegister(lineId);
  };

  if (checking) return null;

  if (walkInMessage) {
    return (
      <div className="register-page">
        <div className="register-form walkin-box">
          <h2 className="walkin-title">Walk-in</h2>
          <p className="walkin-message">{walkInMessage}</p>
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

      <form className="register-form" onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="firstName"
            placeholder="กรอกชื่อ"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />
          <p className={errors.firstName ? "error-text" : "help-text"}>
            {errors.firstName || "Please enter your first name"}
          </p>
        </div>

        <div>
          <input
            type="text"
            name="lastName"
            placeholder="กรอกนามสกุล"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />
          <p className={errors.lastName ? "error-text" : "help-text"}>
            {errors.lastName || "Please enter your last name"}
          </p>
        </div>

        <div>
          <input
            type="text"
            name="citizenId"
            placeholder="กรอกเลขบัตรประชาชน"
            value={form.citizenId}
            autoComplete="off"
            onChange={(e) => {
              const onlyNumber = e.target.value.replace(/\D/g, "");
              setForm({ ...form, citizenId: onlyNumber.slice(0, 13), passportId: "" });
            }}
          />
          {errors.citizenId && <p className="error-text">{errors.citizenId}</p>}
        </div>

        <p className="or-divider">or</p>

        <div>
          <input
            type="text"
            name="passportId"
            placeholder="Passport ID (for Foreign Students)"
            value={form.passportId}
            autoComplete="off"
            onChange={(e) => {
              const value = e.target.value.replace(/[^A-Za-z0-9]/g, "");
              setForm({ ...form, passportId: value.slice(0, 9), citizenId: "" });
            }}
          />

          <p
            className={
              errors.id || errors.passportId ? "error-text" : "help-text"
            }
          >
            {errors.passportId || errors.id}
          </p>
        </div>

        <div>
          <input
            type="text"
            name="phone"
            placeholder="กรอกเบอร์มือถือ"
            value={form.phone}
            onChange={(e) => {
              const onlyNumber = e.target.value.replace(/\D/g, "");
              setForm({
                ...form,
                phone: onlyNumber.slice(0, 10),
              });
            }}
          />

          <p className={errors.phone ? "error-text" : "help-text"}>
            {errors.phone || "Enter your phone number that we can contact you"}
          </p>
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Complete"}
        </button>

        {errors.submit && <p className="error-text">{errors.submit}</p>}
      </form>
    </div>
  );
}

export default Register;
