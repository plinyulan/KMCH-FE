import "./CheckVaccine.css";

export default function CheckVaccine() {
  const vaccineLink = "http://mobile.kmch.kmitl.ac.th/vaccine/#/vaccine/form";

  return (
    <div className="check-vaccine-page">
      <div className="check-vaccine-card">
        <h1 className="check-vaccine-title">
          คุณยังไม่ได้กรอก
          <br />
          ข้อมูลประวัติวัคซีน
        </h1>

        <p className="check-vaccine-description">
          กรุณาเปิดเว็บไซต์เพื่อกรอกข้อมูลประวัติวัคซีน
          <br />
          ก่อนดำเนินการต่อ
        </p>

        <a
          href={vaccineLink}
          target="_blank"
          rel="noopener noreferrer"
          className="check-vaccine-link"
        >
          <div className="link-content">
            <span className="link-title">
              เว็บไซต์กรอกข้อมูลประวัติวัคซีน
            </span>

            <span className="link-subtitle">
              กดปุ่มนี้เพื่อเปิดเว็บไซต์
            </span>
          </div>

          <span className="link-arrow">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="link-arrow-icon"
            >
              <path
                d="M9 6L15 12L9 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </a>
      </div>
    </div>
  );
}
