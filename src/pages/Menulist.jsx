import { useNavigate } from "react-router-dom";
import "./Menulist.css";

import studentImage from "../image/std.png";
import employeeImage from "../image/emp.png";
import organizationImage from "../image/org.png";

function Menulist() {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: "student",
      title: "สำหรับนักศึกษา",
      description: (
        <>
          ลงทะเบียนตรวจสุขภาพสำหรับ
          <br />
          นักศึกษา
        </>
      ),
      image: studentImage,
      theme: "orange",
      path: "/register",
    },
    {
      id: "employee",
      title: "สำหรับบุคลากร",
      description: "อาจารย์และเจ้าหน้าที่",
      image: employeeImage,
      theme: "blue",
      path: "/register-vaccine",
    },
    {
      id: "organization",
      title: (
        <>
          บุคคลภายนอก/
          <br />
          คู่สัญญา
        </>
      ),
      description: "ผู้มาติดต่อและบริษัทคู่สัญญา",
      image: organizationImage,
      theme: "orange",
      path: "/register-company",
    },
  ];

  return (
    <main className="menulist-page">
      <div className="menulist-background" aria-hidden="true">
        <span className="menulist-shape shape-orange-top" />
        <span className="menulist-shape shape-blue-right" />
        <span className="menulist-shape shape-orange-bottom" />
        <span className="menulist-shape shape-blue-bottom" />

        <span className="menulist-bubble bubble-one" />
        <span className="menulist-bubble bubble-two" />
        <span className="menulist-bubble bubble-three" />
      </div>

      <section className="menulist-container">
        <header className="menulist-header">
          <h1 className="menulist-title">
            เลือกประเภท <span>ผู้ใช้งาน</span>
          </h1>

          <div className="menulist-gradient-line" aria-hidden="true" />

          <p className="menulist-subtitle">
            กรุณาเลือกประเภทเพื่อดำเนินการต่อ
          </p>
        </header>

        <div className="menulist-items">
          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`menulist-card menulist-card-${item.theme}`}
              onClick={() => navigate(item.path)}
            >
              <span className="menulist-card-light" aria-hidden="true" />
              <span className="menulist-card-glow" aria-hidden="true" />

              <span className="menulist-image-wrapper">
                <img
                  src={item.image}
                  alt=""
                  className="menulist-image"
                />
              </span>

              <span className="menulist-divider" aria-hidden="true" />

              <span className="menulist-card-content">
                <span className="menulist-card-title">
                  {item.title}
                </span>

                <span className="menulist-card-line" aria-hidden="true" />

                <span className="menulist-card-description">
                  {item.description}
                </span>
              </span>

              <span className="menulist-arrow-wrapper" aria-hidden="true">
                <svg
                  className="menulist-arrow"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M9 5.5L15.5 12L9 18.5"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Menulist;