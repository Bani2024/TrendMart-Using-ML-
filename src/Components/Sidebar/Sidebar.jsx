import { FaBox, FaChartBar, FaHome, FaPowerOff, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // ✅ for redirect
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/Login", { replace: true });
    window.history.pushState(null, "", "/Login");
  };

  return (
    <div className="sidebar">
      <h2>🛒 BigMart</h2>

      <ul>
        <li><FaHome /> Dashboard</li>
        <li><FaBox /> Products</li>
        <li><FaUsers /> Customers</li>
        <li><FaChartBar /> Reports</li>
      </ul>

      {/* ✅ Logout button */}
      <div className="logout" onClick={handleLogout}>
        <FaPowerOff /> Logout
      </div>
    </div>
  );
};

export default Sidebar;
