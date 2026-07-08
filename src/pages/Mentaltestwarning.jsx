import "./Mentaltestwarning.css";
import { useNavigate } from "react-router-dom";

function MentalTestWarning() {
  const navigate = useNavigate();

  return (
    <div className="mental-page">
      <div className="mental-card">
        <h1 className="mental-title">
          คุณยังไม่ได้ทำแบบทดสอบสุขภาพจิต
        </h1>

        <p className="mental-desc">
          กรุณากดที่ลิงก์ด้านล่างเพื่อทำแบบทดสอบ
        </p>

        <p className="mental-link">
          <a
            href="https://tally.so/r/1A2z21"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://tally.so/r/1A2z21
          </a>
        </p>

        <button
          className="mental-btn"
          onClick={() => navigate("/register-success")}
        >
        กลับสู่หน้าเมนู
          <br />
        </button>
      </div>
    </div>
  );
}

export default MentalTestWarning;