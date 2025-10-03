import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

import "../App.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await loginUser(email, password);

    if (result.message === "Login successful") {
      localStorage.setItem("user", JSON.stringify(result.user)); 

      if (result.role === "student") navigate("/student");
      else if (result.role === "company") navigate("/company");
      else if (result.role === "college") navigate("/college");
    } else {
      setError(result.error || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
         {error && <p className="error">{error}</p>}

  <p>
    Forgot password? <a href="/forgot-password">Click here</a>
  </p>
  <p>
    Don't have an account? <a href="/signup">Create Account</a>
  </p>
      </form>
    </div>
  );
};

export default LoginForm;
