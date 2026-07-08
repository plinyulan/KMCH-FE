import "./Statepath.css";

import studentImg from "../image/Student.png";
import enrolImg from "../image/enrol.png";
import qrImg from "../image/qrcode.png";
import doctorImg from "../image/seedoctor.png";
import mentalImg from "../image/mantal.png";
import xrayImg from "../image/x-ray.png";

function StatePath() {
  // backendRouteType set by scan-after-payment: C or D = needs psychologist
  const backendRouteType = localStorage.getItem("backendRouteType");
  const pathType = (backendRouteType === "C" || backendRouteType === "D") ? "MENTAL" : "NORMAL";

  const pathMap = {
    NORMAL: [
      {
        title: "ลงทะเบียนและ\nยืนยันตัวตน",
        color: "blue",
        img: enrolImg,
        desc: "ลงทะเบียนในระบบของทางโรงพยาบาล ณ โถงบริการผู้ป่วยนอก (จุดทางเข้า)",
      },
      {
        title: "ชำระเงิน",
        color: "orange",
        img: qrImg,
        desc: "ชำระเงินด้วย QR Code ของโรงพยาบาล จำนวน 400 บาท ณ โถงบริการผู้ป่วยนอก (ริมกระจก)",
      },
      {
        title: "พบแพทย์",
        color: "blue",
        img: doctorImg,
        desc: "พบแพทย์เพื่อตรวจคัดกรองสุขภาพเบื้องต้น ณ OPD 1",
        stationNumber: 4,
      },
      {
        title: "X-ray",
        color: "orange",
        img: xrayImg,
        desc: "เอ็กซ์เรย์ทรวงอก ณ ชั้น B (ลงบันไดเลื่อน)",
        stationNumber: 5,
      },
    ],

    MENTAL: [
      {
        title: "ลงทะเบียนและ\nยืนยันตัวตน",
        color: "blue",
        img: enrolImg,
        desc: "ลงทะเบียนในระบบของทางโรงพยาบาล ณ โถงบริการผู้ป่วยนอก (จุดทางเข้า)",
      },
      {
        title: "ชำระเงิน",
        color: "orange",
        img: qrImg,
        desc: "ชำระเงินด้วย QR Code ของโรงพยาบาล จำนวน 400 บาท ณ โถงบริการผู้ป่วยนอก (ริมกระจก)",
      },
      {
        title: "คัดกรองสุขภาพจิต",
        color: "orange",
        img: mentalImg,
        desc: "คัดกรองสุขภาพจิตโดยนักจิต ณ โถงบริการผู้ป่วยนอก (ริมหน้าต่าง)",
      },
      {
        title: "พบแพทย์",
        color: "blue",
        img: doctorImg,
        desc: "พบแพทย์เพื่อตรวจคัดกรองสุขภาพเบื้องต้น ณ OPD 1",
      },
      {
        title: "X-ray",
        color: "orange",
        img: xrayImg,
        desc: "เอ็กซ์เรย์ทรวงอก ณ ชั้น B (ลงบันไดเลื่อน)",
      },
    ],
  };

  const currentPath = pathMap[pathType];

  return (
    <div className="statepath-page">
      <div className="statepath-card">
        <div className="blob-orange"></div>
        <div className="blob-cream"></div>

        <div className="deco deco-purple top"></div>
        <div className="deco deco-yellow one"></div>
        <div className="deco deco-blue two"></div>
        <div className="deco deco-orange three"></div>
        <div className="deco deco-yellow four"></div>
        <div className="deco deco-orange five"></div>

        <div className="hero">
          <div>
            <h1>Route :</h1>
            <h2>การเข้ารับตรวจร่างการสำหรับนักศึกษาใหม่</h2>
          </div>
          <img src={studentImg} alt="student" />
        </div>

        <div className="stations">
          {currentPath.map((item, index) => (
            <div className={`station station-${index + 1}`} key={index}>
              <img src={item.img} alt="" className="station-img" />
              <div className="station-text">
                <h3>สถานีที่ {item.stationNumber ?? (index + 1)}:</h3>
                <h4 className={item.color}>
                  {item.title.split("\n").map((line, i) => (
                    <span key={i}>{line}<br /></span>
                  ))}
                </h4>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StatePath;
