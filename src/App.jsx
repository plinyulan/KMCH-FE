import { Routes, Route } from "react-router-dom";

import Menu from "./pages/Menu";
import Register from "./pages/Register";
import QA1 from "./pages/QA1";
import QA2 from "./pages/QA2";
import QA3 from "./pages/QA3";
import Advice from "./pages/Advice";
import Mentaltestwarning from "./pages/Mentaltestwarning";
import Tranferconfirm from "./pages/Transferconfirm";
import Queue from "./pages/Queue";
import Finish from "./pages/Finish";
import Xray from "./pages/Xray";
import Registersuccess from "./pages/Registersuccess";
import Statepath from "./pages/Statepath";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="/register" element={<Register />} />
      <Route path="/QA1" element={<QA1 />} />
      <Route path="/QA2" element={<QA2 />} />
      <Route path="/QA3" element={<QA3 />} />
      <Route path="/advice" element={<Advice />} />
      <Route path="/mental-test-warning" element={<Mentaltestwarning />} />
      <Route path="/transfer-confirm" element={<Tranferconfirm />} />
      <Route path="/queue" element={<Queue />} />
      <Route path="/finish" element={<Finish />} />
      <Route path="/x-ray" element={<Xray />} />
      <Route path="/register-success" element={<Registersuccess />} />
      <Route path="/state-path" element={<Statepath />} />

    </Routes>
  );
}

export default App;