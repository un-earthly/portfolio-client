import { Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import RequireAdmin from "./Components/RequireAdmin";
import Message from "./Components/Message.js";
import ManageSkills from "./Components/ManageSkills.js";
import ManageProject from "./Components/ManageProject.js";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Error from "./Components/Error";
function App() {
  return (
    <div className="App">
      <div id="serialcursor"></div>
      <Routes>

        <Route path='/' element={<Home />} />
        <Route path="/admin" element={<RequireAdmin></RequireAdmin>}>
          <Route index element={<Message />} />
          <Route path="/admin/messages" element={<Message />} />
          <Route path="/admin/skills" element={<ManageSkills />} />
          <Route path="/admin/manage-project" element={<ManageProject />} />
          <Route path="*" element={<Error />} />
        </Route>
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
