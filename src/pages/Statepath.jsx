import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Statepath.css";

import studentImg from "../image/Student.png";
import enrolImg from "../image/enrol.png";
import qrImg from "../image/qrcode.png";
import doctorImg from "../image/seedoctor.png";
import mentalImg from "../image/mantal.png";
import transferImg from "../image/transfer.png";
import xrayImg from "../image/x-ray.png";
import { apiGet, getLineId, DEFAULT_EVENT_ID } from "../services/api";

function StatePath() {
  const navigate = useNavigate();

  const qa1 = Number(localStorage.getItem("qa1"));
  const qa2 = Number(localStorage.getItem("qa2"));

  const userData = JSON.parse(localStorage.getItem("userData")) || {
    isSavia: false,
    isWalkIn: false,
  };

  const transferConfirm = localStorage.getItem("transferConfirm");

  const noNeedTransfer = qa1 === 1 || qa2 === 1;
  const needAskTransfer = qa1 !== 1 && qa2 !== 1;

  // mental-check from backend: needs mental station only when the patient
  // hasn't completed the screening form (not in the Excel). The is_sv flag is
  // currently sourced from the same Excel as psyeval_form, so it would always
  // duplicate the result — ignore it until a separate "severe" file is wired.
  const [needsMental, setNeedsMental] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const lineId = await getLineId();
      if (!lineId) return;
      try {
        const data = await apiGet(
          `/patients/${encodeURIComponent(lineId)}/check?event_id=${DEFAULT_EVENT_ID}`
        );
        if (!cancelled && data?.psyeval_form === false) {
          setNeedsMental(true);
        }
      } catch {
        // not registered / network error — leave needsMental as false
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  let pathType = "NORMAL";

  if (userData.isWalkIn) {
    pathType = "WALKIN_MENTAL";
  } else if (needAskTransfer && transferConfirm === "true" && userData.isSavia) {
    pathType = "MENTAL_TRANSFER";
  } else if (needAskTransfer && transferConfirm === "true") {
    pathType = "TRANSFER";
  } else if (userData.isSavia) {
    pathType = "MENTAL";
  } else if (noNeedTransfer) {
    pathType = "NORMAL";
  }

  // Override from backend check: MENTAL station required.
  // If transfer is also required, upgrade NORMAL→MENTAL and TRANSFER→MENTAL_TRANSFER.
  if (needsMental) {
    pathType = pathType === "TRANSFER" ? "MENTAL_TRANSFER" : "MENTAL";
  }

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
      },
      {
        title: "X-ray",
        color: "orange",
        img: xrayImg,
        desc: "เอ็กซ์เรย์ทรวงอก ณ ชั้น B (ลงบันไดเลื่อน)",
      },
    ],

    TRANSFER: [
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
        title: "ย้ายสิทธิ์",
        color: "blue",
        img: transferImg,
        desc: "ย้ายสิทธิตรงจุดบริการ เพื่อรับสิทธิการรักษาพยาบาลตลอดการศึกษา ณ โถงบริการผู้ป่วยนอก (ริมกระจก)",
      },
      {
        title: "พบแพทย์",
        color: "orange",
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

    MENTAL_TRANSFER: [
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
        title: "ย้ายสิทธิ์",
        color: "blue",
        img: transferImg,
        desc: "ย้ายสิทธิตรงจุดบริการ เพื่อรับสิทธิการรักษาพยาบาลตลอดการศึกษา ณ โถงบริการผู้ป่วยนอก (ริมกระจก)",
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

    WALKIN_MENTAL: [
      {
        title: "คัดกรองสุขภาพจิต",
        color: "orange",
        img: mentalImg,
        desc: "คัดกรองสุขภาพจิตโดยนักจิตก่อนเข้ารับบริการ",
      },
      {
        title: "ลงทะเบียนและ\nยืนยันตัวตน",
        color: "blue",
        img: enrolImg,
        desc: "ลงทะเบียนในระบบของทางโรงพยาบาล ณ โถงบริการผู้ป่วยนอก",
      },
      {
        title: "ชำระเงิน",
        color: "orange",
        img: qrImg,
        desc: "ชำระเงินด้วย QR Code ของโรงพยาบาล จำนวน 400 บาท",
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
            <h2>
              การเข้ารับตรวจร่างการสำหรับนักศึกษาใหม่
            </h2>
          </div>

          <img src={studentImg} alt="student" />
        </div>

        <div className="stations">
          {currentPath.map((item, index) => (
            <div className={`station station-${index + 1}`} key={index}>
              <img src={item.img} alt="" className="station-img" />

              <div className="station-text">
                <h3>สถานีที่ {index + 1}:</h3>

                <h4 className={item.color}>
                  {item.title.split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
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