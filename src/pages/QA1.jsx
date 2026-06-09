import { useNavigate } from "react-router-dom";
import "./QA1.css";

function QA1() {
  const navigate = useNavigate();

  const handleAnswer = (score) => {
    localStorage.setItem("transferScore", score);
    navigate("/QA2");
  };

  return (
    <div className="transfer-q1-page">
      <div className="transfer-q1-card">
        <div className="transfer-q1-title">
          แบบสอบถามเกี่ยวกับการย้ายสิทธิ
        </div>

        <div className="transfer-q1-subtitle">
          ระบบจะตรวจสอบว่าท่านจำเป็นต้องย้ายสิทธิการรักษาหรือไม่
          เพื่อให้สามารถเข้ารับบริการได้อย่างถูกต้องและรวดเร็ว
        </div>

        <div className="transfer-q1-stepper">
          <span className="transfer-q1-step active">1</span>
          <span className="transfer-q1-line"></span>
          <span className="transfer-q1-step">2</span>
          <span className="transfer-q1-line"></span>
          <span className="transfer-q1-step">3</span>
        </div>

        <div className="transfer-q1-question">
          1.คุณเป็นบุตรข้าราชการหรือไม่
        </div>

        <div className="transfer-q1-note">
          <div className="transfer-q1-note-head">NOTE:</div>
          ผู้ที่ใช้สิทธิสวัสดิการรักษาพยาบาลข้าราชการหรือใช้สิทธิผ่านบิดาหรือมารดาที่เป็นข้าราชการสามารถเข้ารับบริการตามสิทธิได้โดยตรง
          เนื่องจากสิทธิดังกล่าวไม่ได้ผูกกับหน่วยบริการประจำเหมือนสิทธิหลักประกันสุขภาพ{" "}
          <span className="transfer-q1-orange">
            อาทิเช่น
            <br />
            สิทธิข้าราชการกรุงเทพมหานคร
            <br />
            สิทธิข้าราชการเบิกตรงกรมบัญชีกลาง
            <br />
            สิทธิสวัสดิการของเจ้าหน้าที่/
            <br />
            ข้าราชการท้องถิ่น (อปท.)
          </span>
        </div>

        <div className="transfer-q1-buttons">
          <button className="transfer-q1-btn yes" onClick={() => handleAnswer(1)}>
            ใช่
          </button>

          <button className="transfer-q1-btn no" onClick={() => handleAnswer(0)}>
            ไม่
          </button>
        </div>
      </div>
    </div>
  );
}

export default QA1;