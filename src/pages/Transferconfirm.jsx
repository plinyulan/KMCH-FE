import { useNavigate } from "react-router-dom";
import "./Transferconfirm.css";

function TransferConfirm() {
  const navigate = useNavigate();

  const handleYes = () => {
    localStorage.setItem("needTransfer", "true");
    navigate("/state-path");
  };

  const handleNo = () => {
    localStorage.setItem("needTransfer", "false");
    navigate("/state-path");
  };

  return (
    <div className="transfer-confirm-page">
      <div className="transfer-confirm-card">
        <h1 className="transfer-confirm-title">
          คุณต้องการย้ายสิทธิหรือไม่
        </h1>

        <p className="transfer-confirm-desc">
          กรณีที่ไม่มั่นใจหรือไม่แน่ใจให้กดปุ่ม "ใช่" 
          <br />
          เพื่อติดต่อเจ้าหน้าที่ในสถานีย้ายสิทธิ
        </p>

        <div className="transfer-confirm-buttons">
          <button
            className="transfer-confirm-btn yes"
            onClick={handleYes}
          >
            ใช่
          </button>

          <button
            className="transfer-confirm-btn no"
            onClick={handleNo}
          >
            ไม่
          </button>
        </div>
      </div>
    </div>
  );
}

export default TransferConfirm;