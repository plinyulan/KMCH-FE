import { useNavigate } from "react-router-dom";
import checked from "../image/checked.png";
import "./Registersuccess.css";

function RegisterSuccess() {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/state-path");
  };

  return (
    <div className="register-success-page">
      <div className="register-success-card">
        <div className="register-success-icon">
          <img
            src={checked}
            alt="success"
            className="register-success-image"
          />
        </div>

        <h1 className="register-success-title">
          ลงทะเบียนสำเร็จ
        </h1>

        <p className="register-success-desc">
          ระบบได้บันทึกข้อมูลของคุณเรียบร้อยแล้ว
        </p>

        <button
          className="register-success-button"
          onClick={handleNext}
        >
          ถัดไป
        </button>
      </div>
    </div>
  );
}

export default RegisterSuccess;