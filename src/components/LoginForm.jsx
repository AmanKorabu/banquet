import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../assets/form.css";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // ✅ Auto-redirect if already logged in
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const apiUrl = `/banquetapi/user_login_new.php?${new URLSearchParams({ user_name: username, password: password })}`;  // This is the proxy URL

      console.log("Logging in with:", username, password);

      // Send request to the proxy URL
      const response = await axios.post(
        apiUrl,
        new URLSearchParams({
          user_name: username,
          password: password,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',  // Important for URLSearchParams
          },
        }
      );

      console.log("API Response:", response.data);

      if (response.data.result && response.data.result.length > 0) {
        const user = response.data.result[0];

        if (user.u_name === username && user.u_pass === password) {
          // ✅ Save full user object to localStorage
          localStorage.setItem("user", JSON.stringify(user));

          // ✅ Save hotel_id separately
          if (user.hotel_id || user.Hotelid) {
            const hotelId = user.hotel_id || user.Hotelid;
            localStorage.setItem("hotel_id", hotelId);
            console.log("✅ Hotel ID saved:", hotelId);
          } else {
            console.warn("⚠️ hotel_id not found in API response");
          }

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
      if (err.response) {
        console.error("Response error data:", err.response.data);
      } else {
        console.error("Error message:", err.message);
      }
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
              userSelect: "none",
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
