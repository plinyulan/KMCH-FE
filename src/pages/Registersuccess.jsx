import { useNavigate } from "react-router-dom";
import checked from "../image/checked.png";
import "./Registersuccess.css";

function RegisterSuccess() {
  const navigate = useNavigate();

  const handleNext = () => {
    //navigate("/state-path");
  };

  return (
    <div className="register-success-page">
      <div className="register-success-card">
        <div className="register-success-icon">
          <img src={checked} alt="success" className="register-success-image" />
        </div>

        <h1 className="register-success-title">
          ระบบได้บันทึกข้อมูลของคุณเรียบร้อยแล้ว
        </h1>

        {/* <h2 className="register-success-subtitle">
          กรุณาเดินไปที่จุดลงทะเบียน
        </h2> */}

        <p className="register-success-desc">
          ขอบคุณที่เป็นเพื่อนกับเรา เราจะส่งข่าวสารผ่านบัญชีไลน์ของคุณเป็นระยะ ๆ
          เพื่ออัปเดตข้อมูลและแจ้งเตือนต่าง ๆ
        </p>

        {/* <button className="register-success-button" onClick={handleNext}>
          ถัดไป
        </button> */}
      </div>
    </div>
  );
}

export default RegisterSuccess;
