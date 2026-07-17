import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { vaccineApiPost, getLineId, setLineId } from "../services/api";
import "./RegisterVaccine.css";

function RegisterVaccine() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    citizenId: "",
    employeeId: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    let newValue = value;

    // เลขบัตรประชาชนและเบอร์โทรศัพท์ รับเฉพาะตัวเลข
    if (name === "citizenId" || name === "phone") {
      newValue = value.replace(/\D/g, "");
    }

    // เลขอัตราจ้างรองรับ เช่น 852, 1110, 786(ร), 418(ช), 870(ป)
    // ลบเฉพาะช่องว่าง
    if (name === "employeeId") {
      newValue = value.replace(/\s/g, "");
    }

    setForm((previousForm) => ({
      ...previousForm,
      [name]: newValue,
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.citizenId) {
      newErrors.citizenId = "กรุณากรอกเลขบัตรประชาชน";
    } else if (form.citizenId.length !== 13) {
      newErrors.citizenId = "เลขบัตรประชาชนต้องมี 13 หลัก";
    }

    if (!form.employeeId.trim()) {
      newErrors.employeeId = "กรุณากรอกเลขอัตราจ้าง";
    }

    if (!form.phone) {
      newErrors.phone = "กรุณากรอกเบอร์โทรศัพท์";
    } else if (form.phone.length !== 10) {
      newErrors.phone = "เบอร์โทรศัพท์ต้องมี 10 หลัก";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    let lineId = await getLineId();

    if (!lineId) {
      lineId = `dev-${form.citizenId}`;
      setLineId(lineId);
    }

    const body = {
      id_card: form.citizenId,
      employee_no: form.employeeId,
      tel_no: form.phone,
      line_id: lineId,
    };

    try {
      setSubmitting(true);
      const resp = await vaccineApiPost("/line/register-vaccine", body);

      if (resp?.found) {
        navigate("/register-success");
      } else {
        navigate("/check-vaccine");
      }
    } catch (err) {
      setErrors({ submit: err.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="register-vaccine-page">
      <section className="register-vaccine-content">
        <h1 className="register-vaccine-title">
          ลงทะเบียนฉีดวัคซีน
        </h1>

        <p className="register-vaccine-description">
          กรุณากรอกข้อมูลให้ครบถ้วน
          <br />
          เพื่อเข้ารับบริการฉีดวัคซีน
        </p>

        <form
          className="register-vaccine-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="register-vaccine-form-group">
            <label htmlFor="citizenId">
              เลขบัตรประชาชน
            </label>

            <input
              id="citizenId"
              name="citizenId"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="กรอกเลขบัตรประชาชน 13 หลัก"
              value={form.citizenId}
              onChange={handleChange}
              maxLength={13}
              className={errors.citizenId ? "input-error" : ""}
              aria-invalid={Boolean(errors.citizenId)}
              aria-describedby={
                errors.citizenId ? "citizenId-error" : undefined
              }
            />

            {errors.citizenId && (
              <p
                id="citizenId-error"
                className="register-vaccine-error"
              >
                {errors.citizenId}
              </p>
            )}
          </div>

          <div className="register-vaccine-form-group">
            <label htmlFor="employeeId">
              เลขอัตราจ้าง
            </label>

            <input
              id="employeeId"
              name="employeeId"
              type="text"
              inputMode="text"
              autoComplete="off"
              placeholder="เช่น 852 หรือ 786(ป)"
              value={form.employeeId}
              onChange={handleChange}
              maxLength={10}
              className={errors.employeeId ? "input-error" : ""}
              aria-invalid={Boolean(errors.employeeId)}
              aria-describedby={
                errors.employeeId
                  ? "employeeId-error"
                  : "employeeId-example"
              }
            />

            {errors.employeeId && (
              <p
                id="employeeId-error"
                className="register-vaccine-error"
              >
                {errors.employeeId}
              </p>
            )}
          </div>

          <div className="register-vaccine-form-group">
            <label htmlFor="phone">
              เบอร์โทรศัพท์
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="กรอกเบอร์โทรศัพท์ 10 หลัก"
              value={form.phone}
              onChange={handleChange}
              maxLength={10}
              className={errors.phone ? "input-error" : ""}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={
                errors.phone ? "phone-error" : undefined
              }
            />

            {errors.phone && (
              <p
                id="phone-error"
                className="register-vaccine-error"
              >
                {errors.phone}
              </p>
            )}
          </div>

          {errors.submit && (
            <p className="register-vaccine-error">{errors.submit}</p>
          )}

          <button
            className="register-vaccine-button"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "กำลังดำเนินการ..." : "ดำเนินการต่อ"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default RegisterVaccine;