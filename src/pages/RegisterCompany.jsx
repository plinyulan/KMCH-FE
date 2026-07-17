import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterCompany.css";

function RegisterCompany() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    contractCode: "",
    firstName: "",
    lastName: "",
    age: "",
    citizenId: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    let newValue = value;

    if (name === "contractCode") {
      newValue = value.replace(/\D/g, "").slice(0, 10);
    }

    if (name === "age") {
      newValue = value.replace(/\D/g, "").slice(0, 3);
    }

    if (name === "citizenId") {
      newValue = value.replace(/\D/g, "").slice(0, 13);
    }

    if (name === "phone") {
      newValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setFormData((previousData) => ({
      ...previousData,
      [name]: newValue,
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.contractCode.trim()) {
      newErrors.contractCode = "กรุณากรอกรหัสคู่สัญญา";
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "กรุณากรอกชื่อ";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "กรุณากรอกนามสกุล";
    }

    if (!formData.age) {
      newErrors.age = "กรุณากรอกอายุ";
    } else if (Number(formData.age) < 1 || Number(formData.age) > 120) {
      newErrors.age = "กรุณากรอกอายุให้ถูกต้อง";
    }

    if (!formData.citizenId) {
      newErrors.citizenId = "กรุณากรอกเลขบัตรประชาชน";
    } else if (formData.citizenId.length !== 13) {
      newErrors.citizenId = "กรุณากรอกเลขบัตรประชาชน 13 หลัก";
    }

    if (!formData.phone) {
      newErrors.phone = "กรุณากรอกเบอร์โทรศัพท์";
    } else if (formData.phone.length !== 10) {
      newErrors.phone = "กรุณากรอกเบอร์โทรศัพท์ 10 หลัก";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const submitData = {
      contractCode: formData.contractCode.trim(),
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      age: Number(formData.age),
      citizenId: formData.citizenId,
      phone: formData.phone,
    };

    console.log("ข้อมูลลงทะเบียนบริษัท:", submitData);

    /*
      ตอนนี้ยังไม่มี Backend และ API
      จึงจำลองให้ลงทะเบียนผ่านและไปหน้าสำเร็จก่อน

      เมื่อ Backend พร้อม ค่อยเปลี่ยนส่วนนี้เป็น fetch หรือ axios
      เพื่อตรวจรหัสคู่สัญญาจากฐานข้อมูล
    */

    navigate("/register-success");
  };

  return (
    <main className="register-company-page">
      <form
        className="register-company-form"
        onSubmit={handleSubmit}
        noValidate
      >
        <h1 className="register-company-title">ลงทะเบียน</h1>

        <div className="register-company-fields">
          <div className="register-company-field">
            <label
              className="register-company-label"
              htmlFor="contractCode"
            >
              รหัสคู่สัญญา
            </label>

            <input
              id="contractCode"
              type="text"
              inputMode="numeric"
              name="contractCode"
              value={formData.contractCode}
              onChange={handleChange}
              placeholder="กรอกรหัสคู่สัญญา"
              autoComplete="off"
              className={`register-company-input ${
                errors.contractCode ? "register-company-input-error" : ""
              }`}
            />

            {errors.contractCode && (
              <p className="register-company-error">
                {errors.contractCode}
              </p>
            )}
          </div>

          <div className="register-company-field">
            <label
              className="register-company-label"
              htmlFor="firstName"
            >
              ชื่อ
            </label>

            <input
              id="firstName"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="กรอกชื่อ"
              autoComplete="given-name"
              className={`register-company-input ${
                errors.firstName ? "register-company-input-error" : ""
              }`}
            />

            {errors.firstName && (
              <p className="register-company-error">
                {errors.firstName}
              </p>
            )}
          </div>

          <div className="register-company-field">
            <label
              className="register-company-label"
              htmlFor="lastName"
            >
              นามสกุล
            </label>

            <input
              id="lastName"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="กรอกนามสกุล"
              autoComplete="family-name"
              className={`register-company-input ${
                errors.lastName ? "register-company-input-error" : ""
              }`}
            />

            {errors.lastName && (
              <p className="register-company-error">
                {errors.lastName}
              </p>
            )}
          </div>

          <div className="register-company-field">
            <label className="register-company-label" htmlFor="age">
              อายุ
            </label>

            <input
              id="age"
              type="text"
              inputMode="numeric"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="กรอกอายุ"
              autoComplete="off"
              className={`register-company-input ${
                errors.age ? "register-company-input-error" : ""
              }`}
            />

            {errors.age && (
              <p className="register-company-error">{errors.age}</p>
            )}
          </div>

          <div className="register-company-field">
            <label
              className="register-company-label"
              htmlFor="citizenId"
            >
              เลขบัตรประจำตัวประชาชน
            </label>

            <input
              id="citizenId"
              type="text"
              inputMode="numeric"
              name="citizenId"
              value={formData.citizenId}
              onChange={handleChange}
              placeholder="กรอกเลขบัตรประชาชน 13 หลัก"
              autoComplete="off"
              className={`register-company-input ${
                errors.citizenId ? "register-company-input-error" : ""
              }`}
            />

            {errors.citizenId && (
              <p className="register-company-error">
                {errors.citizenId}
              </p>
            )}
          </div>

          <div className="register-company-field">
            <label className="register-company-label" htmlFor="phone">
              เบอร์โทรศัพท์
            </label>

            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="กรอกเบอร์โทรศัพท์ 10 หลัก"
              autoComplete="tel"
              className={`register-company-input ${
                errors.phone ? "register-company-input-error" : ""
              }`}
            />

            {errors.phone && (
              <p className="register-company-error">{errors.phone}</p>
            )}
          </div>
        </div>

        <button type="submit" className="register-company-button">
          เสร็จสิ้น
        </button>
      </form>
    </main>
  );
}

export default RegisterCompany;