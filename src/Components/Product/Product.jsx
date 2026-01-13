import axios from "axios";
import { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaSearch, FaTimes, FaTrash } from "react-icons/fa";
import Sidebar from "../Sidebar/Sidebar.jsx";
import "./Product.css";

function Product() {
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = async () => {
  const res = await axios.get(`http://127.0.0.1:5000/search_product?q=${searchTerm}`);
  setProducts(res.data);
};

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    image: "",
    status: "In Stock",
  });
  const [editId, setEditId] = useState(null);

  // Fetch products from Flask
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get("http://127.0.0.1:5000/products");
    setProducts(res.data);
  };

  const handleAddClick = () => {
    setShowForm(true);
    setEditId(null);
    setFormData({
      name: "",
      category: "",
      price: "",
      quantity: "",
      image: "",
      status: "In Stock",
    });
  };

  const handleCloseForm = () => setShowForm(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await axios.put(`http://127.0.0.1:5000/update_product/${editId}`, formData);
    } else {
      await axios.post("http://127.0.0.1:5000/add_product", formData);
    }

    fetchProducts();
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setEditId(product.id);
    setFormData(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://127.0.0.1:5000/delete_product/${id}`);
    fetchProducts();
  };

  return (
    <div className="product-container">
      <Sidebar />
      <div className="product-content">
        <div className="product-header">
          <h2>Products List</h2>
          <button className="add-btn" onClick={handleAddClick}>
            <FaPlus /> Add Product
          </button>
        </div>

        <div className="product-search">
          <input type="text" placeholder="Search product..." value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}/>
           <button onClick={handleSearch}><FaSearch /></button>
        </div>

        <table className="product-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Image</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.price}</td>
                <td>{p.quantity}</td>
                <td>{p.image}</td>
                <td className={p.status === "Low Stock" ? "low-stock" : ""}>
                  {p.status}
                </td>
                <td>
                  <FaEdit className="action-icon edit" onClick={() => handleEdit(p)} />
                  <FaTrash className="action-icon delete" onClick={() => handleDelete(p.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showForm && (
          <div className="popup-overlay">
            <div className="popup-form">
              <div className="form-header">
                <h3>{editId ? "Edit Product" : "Add New Product"}</h3>
                <FaTimes className="close-icon" onClick={handleCloseForm} />
              </div>

              <form onSubmit={handleSubmit}>
                <label>Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

                <label>Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />

                <label>Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />

                <label>Image</label>
                <input
                  type="text"
                  name="image"
                  placeholder="Image URL or name"
                  value={formData.image}
                  onChange={handleChange}
                />

                <label>Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />

                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option>In Stock</option>
                  <option>Low Stock</option>
                  <option>Out of Stock</option>
                </select>

                <button type="submit" className="save-btn">
                  {editId ? "Update Product" : "Save Product"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Product;
