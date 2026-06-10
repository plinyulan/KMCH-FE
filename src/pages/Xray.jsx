import { useNavigate } from "react-router-dom";
import "./Xray.css";
import successImg from "../image/final.png";

function Xray() {
  const navigate = useNavigate();

  const handleFinish = () => {
    navigate("/finish");
  };

  return (
    <div className="xray-page">
      <div className="xray-card">
        <div className="xray-icon">
          <img
            src={successImg}
            alt="Success"
            className="xray-success-image"
          />
        </div>

        <h1 className="xray-main-title">
          คุณเข้ารับบริการ
          <br />
          ครบทุกสถานีแล้ว
        </h1>

      </div>
    </div>
  );
}

export default Xray;