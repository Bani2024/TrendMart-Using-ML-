
import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import Sidebar from "../Sidebar/Sidebar.jsx";
import "./Dashbooard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [trending, setTrending] = useState([]);
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    document.body.style.background = "white";
    fetch("http://127.0.0.1:5000/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats);
        setTrending(data.trending);
        setPredictions(data.predictions);
      });
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <h1>BigMart Admin Panel</h1>

        <div className="cards">
          <div className="card">💰 Total Sales<br />₹{stats.total_sales}</div>
          <div className="card">📦 Products<br />{stats.products}</div>
          <div className="card">👥 Customers<br />{stats.customers}</div>
          <div className="card">🔥 Trending<br />{trending.length}</div>
        </div>

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

        <div className="trending-section">
          <h3>Trending Products</h3>
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
    </div>
  );
};

export default Dashboard;
