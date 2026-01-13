 import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import lock_screen from '../Assets/Frame.png';
import password_icon from '../Assets/password.png';
import user_icon from '../Assets/person.png';
import './Login.css';

const Login = () => {
  
   useEffect(() => {
    // Set login page background color
     document.body.style.background = "linear-gradient(#4FB286, #3C896D)";
    // Cleanup: reset background when leaving login page
    return () => {
      document.body.style.backgroundColor = "white"; // default for other pages
    };
  }, []);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      setMessage(data.message);

      if (data.success) {
        navigate("/dashboard");
        // redirect or show dashboard page
      } else {
        alert(" Invalid credentials!");
      }

    } catch (error) {
      console.error("Error:", error);
      setMessage("Server error. Please try again.");
    }
  };

  return (
    <div className="login_page">
    <div className='container'>
    <div className="front">
      <div className="input_img">
        <div className="lock_img">
          <img src={lock_screen} alt="" />
        </div>
        <div className="form_layout">
        <div className="inputs">
           <div className="header">
        <div className="text">Admin Login</div>
        
      </div>
          <form onSubmit={handleSubmit}>
            <div className="input">
              <img src={user_icon} alt="" />
              <input type="text" placeholder='Username'
                value={username} onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="input">
              <img src={password_icon} alt="" />
              <input type="password" placeholder='Password'
                value={password} onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="submit-container">
              <button className="submit" type="submit">Login</button>
            </div>
          </form>

          {/* <div className="forgot-password">
            Forgot Password? <span>Click here</span>
          </div> */}
        </div>
      <p >{message}</p>
      </div>
     </div>
    </div>

      

        
    </div>
    </div>
  );
};

export default Login;
