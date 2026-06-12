import { Routes, Route } from "react-router-dom";

import Menu from "./pages/Menu";
import Register from "./pages/Register";
import Mentaltestwarning from "./pages/Mentaltestwarning";
import Queue from "./pages/Queue";
import Finish from "./pages/Finish";
import Xray from "./pages/Xray";
import Registersuccess from "./pages/Registersuccess";
import Statepath from "./pages/Statepath";
import CompleteDoctor from "./pages/CompleteDoctor";
import Display from "./pages/Display";
import ManualQueue from "./pages/ManualQueue";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="/register" element={<Register />} />
      <Route path="/mental-test-warning" element={<Mentaltestwarning />} />
      <Route path="/queue" element={<Queue />} />
      <Route path="/finish" element={<Finish />} />
      <Route path="/x-ray" element={<Xray />} />
      <Route path="/register-success" element={<Registersuccess />} />
      <Route path="/state-path" element={<Statepath />} />
      <Route path="/complete-doctor" element={<CompleteDoctor />} />
      <Route path="/display" element={<Display />} />
      <Route path="/manual-queue" element={<ManualQueue />} />
    </Routes>
  );
}

export default App;
