import { useNavigate } from "react-router-dom";
import "./CheckVaccine.css";

export default function CheckVaccine() {
  const navigate = useNavigate();

  const vaccineLink = "http://mobile.kmch.kmitl.ac.th/vaccine/#/vaccine/form";

  const handleNext = () => {
    navigate("/register-success");
  };

  return (
    <div className="check-vaccine-page">
      <div className="check-vaccine-card">
        <h1 className="check-vaccine-title">
          คุณยังไม่ได้กรอก
          <br />
          ข้อมูลประวัติวัคซีน
        </h1>

        <p className="check-vaccine-description">
          กรุณากรอกข้อมูลของท่าน
          <br />
          ผ่านเว็บไซต์ด้านล่างนี้
        </p>

        <a
          href={vaccineLink || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="check-vaccine-link"
          onClick={(e) => {
            if (!vaccineLink) {
              e.preventDefault();
            }
          }}
        >
          {vaccineLink || "เว็บไซต์กรอกข้อมูลประวัติวัคซีน"}
        </a>

        <button
          className="check-vaccine-button"
          onClick={handleNext}
        >
          ถัดไป
        </button>
      </div>
    </div>
  );
}