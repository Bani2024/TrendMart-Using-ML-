import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import Dashboard from "./Components/Dash/Dashboard.jsx";
import Login from "./Components/Login/Login.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
