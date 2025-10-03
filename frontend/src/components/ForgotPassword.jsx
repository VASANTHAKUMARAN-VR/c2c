import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendOtp } from "../services/api";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await sendOtp(email);

    if (result.message) {
      alert(result.message);
      navigate("/reset-password", { state: { email } });
    } else {
      setError(result.error || "Error sending OTP");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send OTP</button>
        <p>Click the Send OTP only one time</p>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default ForgotPassword;
