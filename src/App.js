import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import Customers from "./Components/Customers/Customers.jsx";
import Dashboard from "./Components/Dash/Dashboard.jsx";
import Insights from "./Components/Insights/Insights.jsx";
import Login from "./Components/Login/Login.jsx";
import Orders from "./Components/Orders/Orders.jsx";
import Partners from "./Components/Partners/Partners.jsx";
import Product from "./Components/Product/Product.jsx";
import Settings from "./Components/Settings/Settings.jsx";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/product" element={<Product />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/insights" element={<Insights />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
