import { useNavigate } from "react-router-dom";
import "./Finish.css";
import successImg from "../image/finish.png";

function Finish() {
  const navigate = useNavigate();

  const handleFinish = async () => {
    try {
      // ตัวอย่างเรียก backend เพื่อลบออกจากคิว
      // await fetch("http://localhost:3000/api/queue/finish", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ userId: localStorage.getItem("userId") }),
      // });

      localStorage.removeItem("queueId");

      navigate("/menu");
    } catch (error) {
      console.error("Finish queue error:", error);
    }
  };

  return (
    <div className="finish-page">
      <div className="finish-card">
        <img src={successImg} alt="success" className="finish-img" />

        <h1 className="finish-title">คุณได้ทำรายการสำเร็จแล้ว</h1>

        <h2 className="finish-next">
          สถานีต่อไปนี้คือ X-ray
        </h2>

        <button className="finish-btn" onClick={() => navigate("/")}>
          เสร็จสิ้น
        </button>
      </div>
    </div>
  );
}

export default Finish;