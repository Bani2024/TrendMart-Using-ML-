import { useState } from "react";
import { FaSearch, FaUserSlash } from "react-icons/fa";
import Sidebar from "../Sidebar/Sidebar";
import customersData from "./Customer";
import "./Customers.css";

function Customers() {
  const [customers, setCustomers] = useState(customersData);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const handleDeactivate = (id) => {
    const updated = customers.map((c) =>
      c.id === id ? { ...c, status: "Inactive" } : c
    );
    setCustomers(updated);
  };

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    const matchesStatus =
      filterStatus === "All" || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="customers-container">
      <Sidebar />
      <div className="customers-content">
        <div className="customers-header">
          <h2>Customers</h2>
          <div className="search-filter">
            <div className="search-bar">
              <FaSearch />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <table className="customers-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Total Orders</th>
              <th>Total Spent (₹)</th>
              <th>Recent Purchases</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{customer.totalOrders}</td>
                <td>{customer.totalSpent}</td>
                <td>{customer.recentPurchases.join(", ")}</td>
                <td>
                  <span
                    className={`status-badge ${customer.status.toLowerCase()}`}
                  >
                    {customer.status}
                  </span>
                </td>
                <td>
                  {customer.status === "Active" ? (
                    <button
                      className="deactivate-btn"
                      onClick={() => handleDeactivate(customer.id)}
                    >
                      <FaUserSlash /> Deactivate
                    </button>
                  ) : (
                    <span className="inactive-text">Deactivated</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Customers;
