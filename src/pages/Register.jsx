import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    const hasNationalId = form.citizenId.trim() !== "";
    const hasPassportId = form.passportId.trim() !== "";

    // First Name
    if (!form.firstName.trim()) {
      newErrors.firstName = "Please enter your First Name";
    }

    // Last Name
    if (!form.lastName.trim()) {
      newErrors.lastName = "Please enter your Last Name";
    }

    // National ID / Passport
    if (!hasNationalId && !hasPassportId) {
      newErrors.id =
        "Please enter your National ID or Passport Number";
    }

    if (hasNationalId && hasPassportId) {
      newErrors.id =
        "Please enter only one of the IDs";
    }

    // National ID Validation
    if (hasNationalId && !/^\d{13}$/.test(form.citizenId)) {
      newErrors.citizenId =
        "National ID must contain exactly 13 digits";
    }

    // Passport Validation
    if (
      hasPassportId &&
      !/^[A-Za-z0-9]{6,9}$/.test(form.passportId)
    ) {
      newErrors.passportId =
        "Passport ID must contain 6-9 characters";
    }

    // Phone Number (Optional)
    if (
      form.phone.trim() !== "" &&
      !/^\d{10}$/.test(form.phone)
    ) {
      newErrors.phone =
        "Phone Number must contain exactly 10 digits";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      if (hasNationalId) {
        navigate("/QA1");
      } else {
        const mentalDone =
          localStorage.getItem("mentalTestDone") === "true";

        if (mentalDone) {
          navigate("/QA1");
        } else {
          navigate("/mental-test-warning");
        }
      }
    }
  };

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
              const onlyNumber =
                e.target.value.replace(/\D/g, "");

              setForm({
                ...form,
                citizenId: onlyNumber.slice(0, 13),
              });
            }}
          />
          {errors.citizenId && (
            <p>{errors.citizenId}</p>
          )}
        </div>

        {/* Passport ID */}
        <div>
          <input
            type="text"
            name="passportId"
            placeholder="Passport ID (for Foreign Students)"
            value={form.passportId}
            onChange={(e) => {
              const value =
                e.target.value.replace(
                  /[^A-Za-z0-9]/g,
                  ""
                );

              setForm({
                ...form,
                passportId: value.slice(0, 9),
              });
            }}
          />

          {errors.passportId && (
            <p>{errors.passportId}</p>
          )}

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
              const onlyNumber =
                e.target.value.replace(/\D/g, "");

              setForm({
                ...form,
                phone: onlyNumber.slice(0, 10),
              });
            }}
          />

          {errors.phone && (
            <p>{errors.phone}</p>
          )}
        </div>

        <button type="submit">
          Complete
        </button>
      </form>
    </div>
  );
}

export default Register;