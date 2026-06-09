import "../App.css";
import { useNavigate } from "react-router-dom";

import registerImg from "../image/register.png";
import qr from "../image/qr.png";


function Menu() {
  const navigate = useNavigate();

  return (
    <div className="menu-page">
      <div className="menu-item">
        <img src={registerImg} alt="ลงทะเบียน" />
        <button className="btn-orange" onClick={() => navigate("/register")}>
          ลงทะเบียน
        </button>
      </div>

      <div className="menu-item">
        <img src={qr} alt="สแกน QR Code" />
        <button className="btn-blue" onClick={() => navigate("/scan-qr-code")}>
          สแกน QR Code
        </button>
      </div>
    </div>
  );
}

export default Menu;