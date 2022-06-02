import { Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import RequireAdmin from "./Components/RequireAdmin";
import Message from "./Components/Message.js";
import ManageSkills from "./Components/ManageSkills.js";
import ManageProject from "./Components/ManageProject.js";
// import Blogs from "./Components/Blogs";
// import About from "./Components/About";
// import Blog from "./Components/Blog";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home />} />
        {/* <Route path='/blogs' element={<Blogs />} />
        <Route path='/blog/:name' element={<Blog />} />
        <Route path='/About' element={<About />} /> */}
        <Route path="/admin" element={<RequireAdmin></RequireAdmin>}>
          <Route index element={<Message />} />
          <Route path="/admin/messages" element={<Message />} />
          <Route path="/admin/skills" element={<ManageSkills />} />
          <Route path="/admin/manage-project" element={<ManageProject />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
