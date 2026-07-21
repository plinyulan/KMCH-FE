import "./CheckVaccine.css";

export default function CheckVaccine() {
  return (
    <div className="check-vaccine-page">
      <div className="check-vaccine-card">
        <h1 className="check-vaccine-title">
          คุณยังไม่ได้กรอก
          <br />
          ข้อมูลประวัติวัคซีน
        </h1>

        <p className="check-vaccine-description">
          กรุณากรอกข้อมูลใบคัดกรองวัคซีนไข้ใหญ่
          <br />
          ก่อนดำเนินการลงทะเบียน
        </p>

        <a
          href="http://mobile.kmch.kmitl.ac.th/vaccine/#/vaccine/form"
          target="_blank"
          rel="noopener noreferrer"
          className="check-vaccine-link"
        >
            กรอกข้อมูลประวัติวัคซีนไข้หวัดใหญ่
        </a>
      </div>
    </div>
  );
}