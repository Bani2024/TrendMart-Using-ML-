import { useState } from "react";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

import { FaCalendarAlt, FaChartLine, FaFire, FaUpload } from "react-icons/fa";
import Sidebar from "../Sidebar/Sidebar";
import "./Insights.css";

export default function Insights() {
  const [fileName, setFileName] = useState(null);
  const [csvPreview, setCsvPreview] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("2025-10");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔍 STEP: Send file to backend and receive ML results
  // 🔍 STEP: Send file to backend and receive ML results
const runAnalysis = async () => {
  const input = document.querySelector("input[type=file]");
  if (!input.files.length) return;

  setLoading(true);

  const formData = new FormData();
  formData.append("file", input.files[0]);

  try {
    // 1️⃣ Upload CSV to backend
    const res = await fetch("http://localhost:5000/upload_sales_csv", {
      method: "POST",
      body: formData,
    });

    const uploadResponse = await res.json();

    if (!uploadResponse.success) {
      alert("CSV upload failed!");
      setLoading(false);
      return;
    }

    // 2️⃣ Fetch insights now that CSV is uploaded
    const [summaryRes, trendingRes, forecastRes] = await Promise.all([
      fetch("http://localhost:5000/insights/summary"),
      fetch("http://localhost:5000/insights/trending"),
      fetch("http://localhost:5000/insights/forecast"),
    ]);

    const summary = await summaryRes.json();
    const trending = await trendingRes.json();
    const forecast = await forecastRes.json();

    setAnalysis({
      summary: summary.summary,
      trending: trending.trending,
      forecast: forecast.forecast,
    });

  } catch (err) {
    console.error(err);
    alert("Error analyzing CSV");
  }

  setLoading(false);
};


  // handle file selection for preview
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      const lines = text.split(/\r\n|\n/).slice(0, 8);
      setCsvPreview(lines);
    };
    reader.readAsText(file);
  };

  // Dummy KPIs for UI
  const kpis = {
    totalSales: "₹1,25,480",
    revenue: "₹3,45,600",
    productsSold: "7,860",
    activeCustomers: "1,340",
  };

  return (
    <div className="insights-container">
      <Sidebar />

      <div className="insights-content">
        {/* Header */}
        <div className="insights-header">
          <h2>Business Insights Dashboard</h2>

          <div className="insights-controls">
            <div className="date-filter">
              <FaCalendarAlt className="icon" />
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              />
            </div>

            <div className="upload-quick">
              <label className="upload-btn">
                <FaUpload /> Upload CSV
                <input type="file" accept=".csv" onChange={handleFile} />
              </label>
              {fileName && <div className="file-name">{fileName}</div>}
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="kpi-row">
          <div className="kpi-card">
            <div className="kpi-title">Total Sales</div>
            <div className="kpi-value">{kpis.totalSales}</div>
            <div className="kpi-sub">This Month</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-title">Revenue</div>
            <div className="kpi-value">{kpis.revenue}</div>
            <div className="kpi-sub">Predicted</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-title">Products Sold</div>
            <div className="kpi-value">{kpis.productsSold}</div>
            <div className="kpi-sub">Units</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-title">Active Customers</div>
            <div className="kpi-value">{kpis.activeCustomers}</div>
            <div className="kpi-sub">Last 30 days</div>
          </div>
        </div>

        {/* Main analytics row */}
        <div className="analytics-row">

          {/* Left: Sales Forecast */}
          <div className="card large-card">
            <div className="card-header">
              <div><FaChartLine className="header-icon" /> Sales Forecast</div>
              <div className="card-sub">Predicted vs Actual</div>
            </div>

            <div className="chart-placeholder">
              <div className="chart-legend">
                <span className="legend actual">● Actual</span>
                <span className="legend predicted">● Predicted</span>
              </div>
              <div className="chart-box">
                <p className="placeholder-text">
                  <div className="insight-chart">
  <h3>Next 7 Days Sales Forecast</h3>
<LineChart
  width={550}
  height={220}
  data={analysis?.forecast || []}
>

 
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="predicted_sales" stroke="#2563eb" strokeWidth={2} />
  </LineChart>
</div>

                </p>
              </div>
            </div>
          </div>

          {/* Right: Trending predictions */}
          <div className="card small-card">
            <div className="card-header">
              <div><FaFire className="header-icon" /> Trending Predictions</div>
              <div className="card-sub">Top items expected to trend</div>
            </div>

            <div className="trending-list">
              {analysis?.trending ? (
                analysis.trending.map((item, index) => (
                  <div key={index} className="trend-item">
                    <div className="trend-rank">{index + 1}</div>
                    <div className="trend-name">{item.product}</div>
                    <div className="trend-score">+{item.growth}%</div>
                  </div>
                ))
              ) : (
                <>
                  <div className="trend-item">
                    <div className="trend-rank">1</div>
                    <div className="trend-name">Dairy Milk</div>
                    <div className="trend-score">+18%</div>
                  </div>
                  <div className="trend-item">
                    <div className="trend-rank">2</div>
                    <div className="trend-name">Parle-G</div>
                    <div className="trend-score">+12%</div>
                  </div>
                  <div className="trend-item">
                    <div className="trend-rank">3</div>
                    <div className="trend-name">Pepsi 500ml</div>
                    <div className="trend-score">+9%</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Upload + Results */}
        <div className="upload-results">
          <div className="card">
            <div className="card-header">
              <div>CSV Upload Preview</div>
              <div className="card-sub">First 8 lines of the uploaded file</div>
            </div>

            <div className="csv-preview">
              {csvPreview ? (
                <pre>{csvPreview.join("\n")}</pre>
              ) : (
                <p className="placeholder-text">
                  No file selected. Upload a CSV to preview data here.
                </p>
              )}
            </div>
          </div>

          {/* ✔✔✔ REPLACED Prediction Results Section */}
          <div className="card">
            <div className="card-header">
              <div>Prediction Results</div>
              <div className="card-sub">After ML analysis</div>
            </div>

            <div className="prediction-placeholder">
              {!analysis ? (
                <>
                  <p className="placeholder-text">
                    Upload CSV and click Analyze to view insights
                  </p>
                  <button
                    className="analyze-btn"
                    onClick={runAnalysis}
                    disabled={!csvPreview || loading}
                  >
                    {loading ? "Analyzing..." : "Analyze Data"}
                  </button>
                </>
              ) : (
                <div className="analysis-results">

                  <h4>Summary</h4>
                  <pre>{JSON.stringify(analysis.summary, null, 2)}</pre>

                  <h4>Trending Items</h4>
                  <pre>{JSON.stringify(analysis.trending, null, 2)}</pre>

                  <h4>Sales Forecast</h4>
                  <pre>{JSON.stringify(analysis.forecast, null, 2)}</pre>

                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
