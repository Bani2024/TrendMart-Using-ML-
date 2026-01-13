
import { useEffect, useState } from "react";
import { FaBell, FaBox, FaClock, FaEnvelope, FaFire, FaMoneyCheck, FaSearch, FaUser, FaUserCircle } from "react-icons/fa";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, Tooltip, XAxis, YAxis } from "recharts";
import IndiaMap from "../Assets/in.svg";
import Sidebar from "../Sidebar/Sidebar.jsx";
import "./Dashbooard.css";



const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [trending, setTrending] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [lastLogin, setLastLogin] = useState("");
  const [showMailDropdown, setShowMailDropdown] = useState(false);
    const [showNotification, setShowNotification] = useState(false);

  const pieData = [
  { name: "Fruits", value: 400 },
  { name: "Vegetables", value: 300 },
  { name: "Dairy", value: 200 },
  { name: "Snacks", value: 100 },
];


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  useEffect(() => {
    document.body.style.background = "white";
    fetch("http://127.0.0.1:5000/api/dashboard")
      .then((res) => res.json())
      .then((data) => { 
        setStats(data.stats);
        setTrending(data.trending);
        setPredictions(data.predictions);

        //login
         const last = localStorage.getItem("lastLogin");
    setLastLogin(last || "First time login");
    const now = new Date().toLocaleString();
    localStorage.setItem("lastLogin", now);
      });
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar />
        <div className="dashboard-header">
    <h1> Admin Panel</h1>
     <div className="search-bar">
      <input type="text" placeholder="Search products, sales..." />
      <button><FaSearch /></button>
    </div>
       <div
        className="notification"
        onClick={() => setShowNotification(!showNotification)}
      >
        <FaBell />
        {showNotification && (
          <div className="notification-dropdown">
            <p><strong>Notifications</strong></p>
            <hr />
            <p>⚠️ <b>Restock Alert:</b> Low inventory for <em>Parle-G</em></p>
            <p>📦 <b>Stock Update:</b> Dairy Milk has been replenished</p>
            <p>📈 <b>Sales Insight:</b> Beverages up by 12% this week</p>
            <p>🔮 <b>Prediction:</b> Maggi likely to trend next week</p>
            <p className="view-all">View All Alerts</p>
          </div>
        )}
      </div>
     <div className="mail" onClick={() => setShowMailDropdown(!showMailDropdown)}>
      <FaEnvelope />
      {showMailDropdown && (
        <div className="mail-dropdown">
          <p><strong>Inbox</strong></p>
          <hr />
          <p>📩 New supplier request</p>
          <p>💬 Customer feedback received</p>
          <p>📦 Order update: Product restocked</p>
          <p className="view-all">View all messages</p>
        </div>
      )}
    </div>
    
     <button
          className="dropdown-toggle"
          onClick={() => setIsOpen(!isOpen)}
        >
         <FaUserCircle className="profile-icon" />
        </button>

        {isOpen && (
          <div className="dropdown-menu">
            <ul>
               <li className="last-login"><FaClock /> Last login: {lastLogin}</li>
             
            </ul>
          </div>
        )}
    
  </div>
      <div className="dashboard-content">
        

         <div className="kpi-row">
          <div className="kpi-card">
            <div className="kpi-title"><FaMoneyCheck /> Total Sales</div>
            <div className="kpi-value">₹{stats.total_sales}</div>
            <div className="kpi-sub">This Month</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-title"><FaBox /> Products</div>
            <div className="kpi-value">{stats.products}</div>
            <div className="kpi-sub">Units</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-title"><FaUser /> Customers</div>
            <div className="kpi-value">{stats.customers}</div>
            <div className="kpi-sub">Users</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-title"> <FaFire /> Trending</div>
            <div className="kpi-value">{trending.length}</div>
            <div className="kpi-sub">Last 30 days</div>
          </div>
        </div>
         <div className="charts">
         <div className="chart-section">
          <h3>Sales Prediction</h3>
          <LineChart width={500} height={250} data={predictions}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="sales" stroke="#3b82f6" />
          </LineChart>
         </div>
           <div className="piechart">
             <h3>Category Distribution</h3>
     <PieChart width={400} height={300}>
      <Pie
        data={pieData}
        cx="50%"
        cy="50%"
        outerRadius={100}
        fill="#8884d8"
        dataKey="value"
        label
      >
        {pieData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
     </PieChart>
       </div>
        <div className="trending-section">
          <h3><FaFire className="header-icon" />Trending Products</h3>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Sales</th>
              </tr>
            </thead>
            <tbody>
              {trending.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.sales}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
     </div>
<div className="analytics-row">
  {/* 🌍 Buyer Map Card */}

   <div className="map-card">
    <h3>Active Users (India)</h3>

    <div className="india-map">
      <img src={IndiaMap} alt="India Map" className="map-image" />

      {/* 🔵 Hotspots - adjust based on states */}

      {/* Delhi */}
      <div className="hotspot blue" style={{ top: "24%", left: "30%" }}>
        <span>550</span>
      </div>
       {/* Kashmir */}
      <div className="hotspot blue" style={{ top: "14%", left: "26%" }}>
        <span>450</span>
      </div>

       {/* Gujrat*/}
        <div className="hotspot blue" style={{ top: "45%", left: "20%" }}>
        <span>850</span>
      </div>

      {/* Mumbai */}
      <div className="hotspot blue" style={{ top: "48%", left: "33%" }}>
        <span>300</span>
      </div>

      {/* Bangalore */}
      <div className="hotspot blue" style={{ top: "67%", left: "28%" }}>
        <span>280</span>
      </div>

      {/* Kolkata */}
      <div className="hotspot blue" style={{ top: "45%", left: "53%" }}>
        <span>358</span>
      </div>
    </div>
  </div>

{/* 📊 Bar Chart Card */}
<div className="bar-card">
  <h3>Weekly Sales</h3>
 
  <BarChart width={380} height={380} data={[
    { day: "Mon", sales: 120 },
    { day: "Tue", sales: 200 },
    { day: "Wed", sales: 150 },
    { day: "Thu", sales: 300 },
    { day: "Fri", sales: 250 },
    { day: "Sat", sales: 180 },
    { day: "Sun", sales: 220 },
  ]}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="day" />
    <YAxis />
    <Tooltip />
    <Bar dataKey="sales" fill="#4D685A" />
  </BarChart>
</div>

  {/* 💬 Review Card */}
  <div className="review-card">
    <h3>Customer Reviews</h3>
    <div className="review">
      <h4>Riya Sharma ⭐⭐⭐⭐⭐</h4>
      <p>“Amazing quality and fast delivery!”</p>
    </div>
    <div className="review">
      <h4>Arjun Mehta ⭐⭐⭐⭐</h4>
      <p>“Smooth checkout and good packaging.”</p>
    </div>
    <div className="review">
      <h4>Ayesha Khan ⭐⭐⭐⭐⭐</h4>
      <p>“Loved the freshness of products!”</p>
    </div>
     <div className="review">
      <h4>Riya Sharma ⭐⭐⭐⭐⭐</h4>
      <p>“Amazing quality and fast delivery!”</p>
    </div>
     <div className="review">
      <h4>Riya Sharma ⭐⭐⭐⭐⭐</h4>
      <p>“Amazing quality and fast delivery!”</p>
    </div>
  </div>




</div>

     </div>
    </div>
  );
};

export default Dashboard;
