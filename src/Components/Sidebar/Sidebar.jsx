import { FaBox, FaChartLine, FaHandshake, FaPowerOff, FaTruck, FaUsers, FaWrench } from "react-icons/fa";
import { TbLayoutDashboard } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom"; // for redirect
import logo from '../Assets/vege.png';
import "./Sidebar.css";



const Sidebar = () => {
  const navigate = useNavigate();

   const handleLogout = () => {
    localStorage.removeItem("user"); // clear user session if stored
    navigate("/"); // go back to login page
  };

  return (
    <div className="sidebar">
       <div className="logo_section">
        <div className="logo">
        <img src={logo} alt="" />
        </div>
       <h2> TrendMart</h2>
           </div>
      <ul>
        <li>
          <Link to="/dashboard"><TbLayoutDashboard /> Overview</Link>
          </li>
        <li>
          <Link to="/product"><FaBox /> Products</Link>
        </li>
        <li>
          <Link to="/customers"><FaUsers /> Customers</Link>
        </li>
        <li>
          <Link to="/orders"><FaTruck /> Orders</Link>
        </li>
        <li>
          <Link to="/partners"><FaHandshake /> Partners</Link>
        </li>
        <li>
          <Link to="/insights"><FaChartLine /> Insights</Link>
        </li>
        <li>
          <Link to="/settings"><FaWrench /> Settings</Link>
        </li>
      </ul>

      {/* ✅ Logout button */}
      <div className="logout" onClick={handleLogout}>
        <Link to="/" /><FaPowerOff /> Logout
      </div>
    </div>
  );
};

export default Sidebar;
