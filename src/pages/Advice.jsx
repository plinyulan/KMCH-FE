import "./Advice.css";
import { useNavigate } from "react-router-dom";
import { apiGet, getLineId, DEFAULT_EVENT_ID } from "../services/api";

function Advices() {
  const navigate = useNavigate();

  const noTransferNeeded =
    localStorage.getItem("qa1Answer") === "yes" ||
    localStorage.getItem("qa2Answer") === "yes";

  const handleFinish = async () => {
    let psyevalForm = false;
    try {
      const lineId = await getLineId();
      if (lineId) {
        const check = await apiGet(
          `/patients/${encodeURIComponent(lineId)}/check?event_id=${DEFAULT_EVENT_ID}`
        );
        psyevalForm = check?.psyeval_form === true;
      }
    } catch {
      // network error → treat as not-in-Excel and show the warning
    }

    if (psyevalForm) {
      navigate("/register-success");
    } else {
      navigate("/mental-test-warning");
    }
  };

  return (
    <div className="advice-page">
      <div className="advice-card">
        <h1 className="advice-title">
          ข้อมูลแนะนำเรื่องของการย้ายสิทธิ
        </h1>

        {noTransferNeeded ? (
          <p className="advice-text">คุณไม่จำเป็นต้องย้ายสิทธิ์</p>
        ) : (
          <>
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
          </>
        )}

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