import { Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import RequireAdmin from "./Components/RequireAdmin";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/admin" element={<RequireAdmin></RequireAdmin>}></Route>
      </Routes>
    </div>
  );
}

export default App;
