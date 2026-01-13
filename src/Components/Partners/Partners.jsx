import { useState } from "react";
import { FaPlus, FaSearch, FaUserSlash } from "react-icons/fa";
import Sidebar from "../Sidebar/Sidebar";
import partnersData from "./Partners";
import "./Partners.css";

function Partners() {
  const [partners, setPartners] = useState(partnersData);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [newPartner, setNewPartner] = useState({
    name: "",
    contact: "",
    phone: "",
    email: "",
    category: "",
    totalSupplied: "",
  });

  const handleDeactivate = (id) => {
    const updated = partners.map((p) =>
      p.id === id ? { ...p, status: "Inactive" } : p
    );
    setPartners(updated);
  };

  const handleAddPartner = (e) => {
    e.preventDefault();
    const newEntry = {
      ...newPartner,
      id: partners.length + 1,
      status: "Active",
    };
    setPartners([...partners, newEntry]);
    setShowForm(false);
    setNewPartner({
      name: "",
      contact: "",
      phone: "",
      email: "",
      category: "",
      totalSupplied: "",
    });
  };

  const filteredPartners = partners.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.contact.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "All" || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="partners-container">
      <Sidebar />

      <div className="partners-content">
        <div className="partners-header">
          <h2>Partners</h2>
          <div className="search-filter">
            <div className="search-bar">
              <FaSearch />
              <input
                type="text"
                placeholder="Search"
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

            <button className="add-btn" onClick={() => setShowForm(true)}>
              <FaPlus /> Add Partner
            </button>
          </div>
        </div>

        <table className="partners-table">
          <thead>
            <tr>
              <th>Partner Name</th>
              <th>Contact Person</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Category</th>
              <th>Total Supplied</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredPartners.map((partner) => (
              <tr key={partner.id}>
                <td>{partner.name}</td>
                <td>{partner.contact}</td>
                <td>{partner.phone}</td>
                <td>{partner.email}</td>
                <td>{partner.category}</td>
                <td>{partner.totalSupplied}</td>
                <td>
                  <span
                    className={`status-badge ${partner.status.toLowerCase()}`}
                  >
                    {partner.status}
                  </span>
                </td>
                <td>
                  {partner.status === "Active" ? (
                    <button
                      className="deactivate-btn"
                      onClick={() => handleDeactivate(partner.id)}
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

        {/* Add Partner Popup Form */}
        {showForm && (
          <div className="overlay">
            <div className="popup-form">
              <h3>Add New Partner</h3>
              <form onSubmit={handleAddPartner}>
                <input
                  type="text"
                  placeholder="Partner Name"
                  value={newPartner.name}
                  onChange={(e) =>
                    setNewPartner({ ...newPartner, name: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Contact Person"
                  value={newPartner.contact}
                  onChange={(e) =>
                    setNewPartner({ ...newPartner, contact: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={newPartner.phone}
                  onChange={(e) =>
                    setNewPartner({ ...newPartner, phone: e.target.value })
                  }
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newPartner.email}
                  onChange={(e) =>
                    setNewPartner({ ...newPartner, email: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={newPartner.category}
                  onChange={(e) =>
                    setNewPartner({ ...newPartner, category: e.target.value })
                  }
                  required
                />
                <input
                  type="number"
                  placeholder="Total Supplied"
                  value={newPartner.totalSupplied}
                  onChange={(e) =>
                    setNewPartner({
                      ...newPartner,
                      totalSupplied: e.target.value,
                    })
                  }
                  required
                />
                <div className="form-buttons">
                  <button type="submit">Add Partner</button>
                  <button type="button" onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Partners;
