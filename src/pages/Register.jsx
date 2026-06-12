import { useState } from "react";
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

  const isEnglishOnly = (value) => /^[A-Za-z]+$/.test(value);

  const proceedAfterRegister = async (lineId) => {
    try {
      const resp = await apiPost(
        `/patients/${encodeURIComponent(lineId)}/scan-after-payment`,
        {
          event_id: DEFAULT_EVENT_ID,
        },
      );

      if (resp?.route_type) {
        localStorage.setItem("backendRouteType", resp.route_type);
      }
    } catch {}

    let psyevalForm = false;

    try {
      const check = await apiGet(
        `/patients/${encodeURIComponent(
          lineId,
        )}/check?event_id=${DEFAULT_EVENT_ID}`,
      );
      psyevalForm = check?.psyeval_form === true;
    } catch {}

    const mentalDone = localStorage.getItem("mentalTestDone") === "true";

    navigate(
      psyevalForm || mentalDone ? "/register-success" : "/mental-test-warning",
    );
  };

  const continueAfterWalkIn = async () => {
    setWalkInMessage(null);
    const lineId = pendingLineId || (await getLineId());
    await proceedAfterRegister(lineId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    const hasNationalId = form.citizenId.trim() !== "";
    const hasPassportId = form.passportId.trim() !== "";

    if (!form.firstName.trim()) {
      newErrors.firstName = "Please enter your First Name";
    } else if (!isEnglishOnly(form.firstName.trim())) {
      newErrors.firstName = "First Name must be English letters only";
    }

    if (!form.lastName.trim()) {
      newErrors.lastName = "Please enter your Surname";
    } else if (!isEnglishOnly(form.lastName.trim())) {
      newErrors.lastName = "Surname must be English letters only";
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

  if (walkInMessage) {
    return (
      <div className="register-page">
        <div className="register-form walkin-box">
          <p className="walkin-message">{walkInMessage}</p>
          <button type="button" onClick={continueAfterWalkIn}>
            Continue
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
            placeholder="First Name"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />
          <p className={errors.firstName ? "error-text" : "help-text"}>
            {errors.firstName || "Please enter your First Name (English only)"}
          </p>
        </div>

        <div>
          <input
            type="text"
            name="lastName"
            placeholder="Surname"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />
          <p className={errors.lastName ? "error-text" : "help-text"}>
            {errors.lastName || "Please enter your Surname (English only)"}
          </p>
        </div>

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
          {errors.citizenId && <p className="error-text">{errors.citizenId}</p>}
        </div>

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

          <p
            className={
              errors.id || errors.passportId ? "error-text" : "help-text"
            }
          >
            {errors.passportId ||
              errors.id ||
              "Fill in National ID or Passport ID only one field"}
          </p>
        </div>

        <div>
          <input
            type="text"
            name="phone"
            placeholder="Phone Number (Optional)"
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
            {errors.phone || "Enter a phone number the hospital can contact."}
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
