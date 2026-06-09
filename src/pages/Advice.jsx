import "./Advice.css";
import { useNavigate } from "react-router-dom";

function Advices() {
  const navigate = useNavigate();

  const handleFinish = () => {
    // เช็คว่าทำแบบคัดกรองแล้วหรือยัง
    const mentalTestDone = localStorage.getItem("mentalTestDone");

    if (mentalTestDone === "true") {
      // ทำแล้ว -> กลับไปหน้าก่อนหน้า หรือหน้าเมนู
      navigate("/menu");
    } else {
      // ยังไม่ได้ทำ -> ไปหน้าแจ้งเตือน
      navigate("/mental-test-warning");
    }
  };

  return (
    <div className="advice-page">
      <div className="advice-card">
        <h1 className="advice-title">
          ข้อมูลแนะนำเรื่องของการย้ายสิทธิ
        </h1>

        <p className="advice-text">
          ผู้ที่อาศัยอยู่ในกรุงเทพ
          <br />
          หรือปริมณฑลอาจไม่จำเป็นต้องย้ายสิทธิการรักษา
          <br />
          ทั้งนี้ขึ้นอยู่กับประเภทสิทธิและเงื่อนไขของแต่ละ
          <br />
          บุคคล
        </p>

        <p className="advice-text advice-orange">
          หากไม่แน่ใจว่าจำเป็นต้องย้ายสิทธิหรือไม่
          <br />
          กรุณาเลือก “ใช่”
        </p>

        <p className="advice-text">
          เพื่อเข้ารับคำแนะนำจากเจ้าหน้าที่ประจำสถานีย้าย
          <br />
          สิทธิซึ่งจะช่วยตรวจสอบข้อมูลและให้คำแนะนำที่ถูก
          <br />
          ต้องก่อนดำเนินการขั้นตอนถัดไป
        </p>

        <button
          className="advice-finish-btn"
          onClick={handleFinish}
        >
          เสร็จสิ้น
        </button>
      </div>
    </div>
  );
}

export default Advices;