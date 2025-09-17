import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../assets/form.css";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 New state
  const navigate = useNavigate();

  // ✅ Auto-redirect if user is already logged in
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://52.66.71.147/banquetapi/user_login_new.php?user_name=${username}&password=${password}`,
        {
          u_name: username,
          u_pass: password,
        }
      );

      console.log("API Response:", response.data);

      if (response.data.result && response.data.result.length > 0) {
        const user = response.data.result[0];

        if (user.u_name === username && user.u_pass === password) {
          localStorage.setItem("user", JSON.stringify(user));
          toast.success(`✅ Login successful! Welcome ${user.u_name}`);
          navigate("/dashboard");
        } else {
          toast.error("❌ Invalid username or password");
        }
      } else {
        toast.error("❌ Invalid username or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("⚠️ Server error, please try again later");
    }
  };

  return (
    <div className="login-container">
      <h2>Banquet Billing Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        {/* 👇 Password field with toggle */}
        <div style={{ position: "relative", width: "100%", maxWidth: "450px" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", paddingRight: "40px" }}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#007bff",
              fontSize: "14px",
              userSelect: "none"
            }}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
