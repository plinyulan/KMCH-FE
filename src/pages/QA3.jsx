import { useNavigate } from "react-router-dom";
import "./QA3.css";

function QA3() {
  const navigate = useNavigate();

  return (
    <div className="qa3-page">
      <div className="qa3-card">
        <h1 className="qa3-title">แบบสอบถามเกี่ยวกับการย้ายสิทธิ</h1>

        <p className="qa3-description">
          ระบบจะตรวจสอบว่าท่านจำเป็นต้องย้ายสิทธิการรักษาหรือไม่
          <br />
          เพื่อให้สามารถเข้ารับบริการได้อย่างถูกต้องและรวดเร็ว
        </p>

        <div className="qa3-stepper">
          <span>1</span>
          <div className="qa3-line"></div>
          <span>2</span>
          <div className="qa3-line"></div>
          <span>3</span>
        </div>

        <h2 className="qa3-question">
          3.คุณอาศัยอยู่ในเขตกรุงเทพและ
          <br />
          ปริมณฑลหรือไม่
        </h2>

        <p className="qa3-note">
          <span className="qa3-note-head">NOTE: </span>
          <span className="qa3-note-content">
            ผู้ที่มีสิทธิรักษาพยาบาลอยู่ในพื้นที่กรุงเทพมหานครและปริมณฑลส่วนใหญ่สามารถเข้ารับบริการได้โดย
            ไม่ต้องดำเนินการย้ายหน่วยบริการในวันตรวจสุขภาพ{" "}
          </span>
          <span className="qa3-orange">
            พื้นที่ปริมณฑล ได้แก่ จังหวัดนนทบุรี, จังหวัดปทุมธานี,
            จังหวัดสมุทรปราการ, จังหวัดสมุทรสาครและจังหวัดนครปฐม
          </span>
        </p>

        <div className="qa3-buttons">
          <button
            className="qa3-btn qa3-btn-yes"
            onClick={() => navigate("/advice")}
          >
            ใช่
          </button>

          <button
            className="qa3-btn qa3-btn-no"
            onClick={() => navigate("/advice")}
          >
            ไม่
          </button>
        </div>
      </div>
    </div>
  );
}

export default QA3;