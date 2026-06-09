import { useNavigate } from "react-router-dom";
import "./QA2.css";

function QA2() {
  const navigate = useNavigate();

  const handleAnswer = (score) => {
    const oldScore = Number(localStorage.getItem("transferScore")) || 0;
    localStorage.setItem("transferScore", oldScore + score);
    navigate("/QA3");
  };

  return (
    <div className="qa2-page">
      <div className="qa2-content">
        <div className="qa2-title">
          แบบสอบถามเกี่ยวกับการย้ายสิทธิ
        </div>

        <div className="qa2-subtitle">
          ระบบจะตรวจสอบว่าท่านจำเป็นต้องย้ายสิทธิการรักษาหรือไม่
          เพื่อให้สามารถเข้ารับบริการได้อย่างถูกต้องและรวดเร็ว
        </div>

        <div className="qa2-stepper">
          <span className="qa2-step active">1</span>
          <div className="qa2-step-line"></div>

          <span className="qa2-step active">2</span>
          <div className="qa2-step-line"></div>

          <span className="qa2-step">3</span>
        </div>

        <div className="qa2-question-title">
          2.คุณเป็นสิทธิประกันสังคมหรือไม่
        </div>

        <div className="qa2-note-text">
          <span className="qa2-note-head">NOTE:</span>

          <span className="qa2-note-content">
            ผู้ที่อยู่ในระบบประกันสังคมสามารถใช้สิทธิผ่านโรงพยาบาลที่เลือกไว้
            กับสำนักงานประกันสังคมได้อยู่แล้ว
            จึงไม่ต้องดำเนินการย้ายสิทธิในวันตรวจสุขภาพ
          </span>

          <span className="qa2-orange-text">
            ซึ่งสามารถเข้ารับบริการโดยใช้สวัสดิการนักศึกษา
          </span>
        </div>

        <div className="qa2-answer-buttons">
          <button
            className="qa2-answer-btn yes"
            onClick={() => handleAnswer(1)}
          >
            ใช่
          </button>

          <button
            className="qa2-answer-btn no"
            onClick={() => handleAnswer(0)}
          >
            ไม่
          </button>
        </div>
      </div>
    </div>
  );
}

export default QA2;