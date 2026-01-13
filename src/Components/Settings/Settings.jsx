import { useEffect, useState } from "react";
import { FaArrowRight, FaBell, FaGlobe, FaLock, FaMagic, FaPalette, FaUserEdit } from "react-icons/fa";
import Sidebar from "../Sidebar/Sidebar"; // adjust path if needed
import "./Settings.css";


function Settings() {
  const [theme, setTheme] = useState("light");
   const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
const [showNotificationModal, setShowNotificationModal] = useState(false);

 const toggleTheme = () => {
  const newTheme = theme === "light" ? "dark" : "light";
  setTheme(newTheme);
  localStorage.setItem("appTheme", newTheme);
};

useEffect(() => {
  const savedTheme = localStorage.getItem("appTheme");
  if (savedTheme) {
    setTheme(savedTheme);
  }
}, []);

  return (
    <div className={`settings-dashboard-container ${theme}`}>
      {/* Left Sidebar */}
      <Sidebar />

      {/* Right Main Content */}
      <div className="settings-main">
        <h2>Settings</h2>

        {/* Username Section */}
        <div className="settings-section">
          <h2><FaUserEdit /> Change Username</h2>
         
          <div className="open">
          <button style={{fontSize: '20px'}}
            className="open-modal-btn"
            onClick={() => setShowUsernameModal(true)}
          >
            <FaArrowRight />
          </button>
          </div>
        </div>

        {/* Password Section */}
        <div className="settings-section">
          <h2><FaLock /> Change Password</h2>
          
          <div className="open">
          <button style={{fontSize: '20px'}}
            className="open-modal-btn"
            onClick={() => setShowPasswordModal(true)} 
          >
            <FaArrowRight />
          </button>
          </div>
        </div>



        {/* Notification Section */}
        <div className="settings-section">
         <div>
            <h2><FaBell /> Notifications</h2>
                 <p>Manage how you receive notifications.</p>
              </div>

          <button style={{fontSize: '20px'}}
           className="open-modal-btn"
            onClick={() => setShowNotificationModal(true)} // show modal when clicked
           >
             <FaArrowRight />
             </button>

  {/* Notification Modal */}
  {showNotificationModal && (
    <div className="modal-overlay">
      <div className="modal">
        <h2><FaBell /> Notification Settings</h2>
        
        <form className="modal-form">
          <label><input type="checkbox" /> Enable Email Notifications</label>
          <label><input type="checkbox" /> Enable Push Notifications</label>
        </form>

        <div className="modal-buttons">
          <button onClick={() => setShowNotificationModal(false)}>Cancel</button>
          <button>Save</button>
        </div>
      </div>
    </div>
  )}
</div>


   
        {/* Theme Section */}
        <div className="settings-section">
          <h2><FaPalette /> Theme Settings</h2>
          <div className="theme-toggle">
            
            <button onClick={toggleTheme}>
               <FaMagic /> {theme === "light" ? "Dark" : "Light"} Mode
            </button>
          </div>
        </div>


        {/* Language Section */}
        <div className="settings-section">
          <h2><FaGlobe /> Language</h2>
          <select>
            <option>English</option>
            <option>Hindi</option>
            <option>Bengali</option>
            <option>Spanish</option>
          </select>
        </div>
        <footer className="settings-footer">
  <p>© {new Date().getFullYear()} Sarbani, Nikita, Khusboo, Kirti. All rights reserved.</p>
  <p className="footer-links">
    <a href="#">Privacy Policy</a> | <a href="#">Terms & Conditions</a> | <a href="#">Support</a>
  </p>
</footer>
      </div>



        {/* ======= Username Modal ======= */}
      {showUsernameModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2><FaUserEdit /> Change Username</h2>
            <form 
  className="modal-form"
  onSubmit={async (e) => {
    e.preventDefault();
    const currentUsername = e.target[0].value;
    const newUsername = e.target[1].value;

    const response = await fetch("http://localhost:5000/update_username", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current_username: currentUsername, new_username: newUsername }),
    });

    const result = await response.json();
    alert(result.message);

    if (result.success) setShowUsernameModal(false);
  }}
>
  <label>Current Username</label>
  <input type="text" placeholder="Enter current username" required />
  <label>New Username</label>
  <input type="text" placeholder="Enter new username" required />
  <div className="modal-buttons">
    <button type="button" onClick={() => setShowUsernameModal(false)}>Cancel</button>
    <button type="submit">Save Changes</button>
  </div>
</form>

          </div>
        </div>
      )}

      {/* ======= Password Modal ======= */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2><FaLock /> Change Password</h2>
            <form 
  className="modal-form"
  onSubmit={async (e) => {
    e.preventDefault();
    const username = e.target[0].value;
    const currentPassword = e.target[1].value;
    const newPassword = e.target[2].value;

    const response = await fetch("http://localhost:5000/update_password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, current_password: currentPassword, new_password: newPassword }),
    });

    const result = await response.json();
    alert(result.message);

    if (result.success) setShowPasswordModal(false);
  }}
>
  <label>Username</label>
  <input type="text" placeholder="Enter username" required />
  <label>Current Password</label>
  <input type="password" placeholder="Enter current password" required />
  <label>New Password</label>
  <input type="password" placeholder="Enter new password" required />
  <div className="modal-buttons">
    <button type="button" onClick={() => setShowPasswordModal(false)}>Cancel</button>
    <button type="submit">Save Changes</button>
  </div>
</form>

          </div>
        </div>
      )}
    </div>
    
  );
}

export default Settings;
