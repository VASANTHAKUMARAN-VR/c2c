import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { studentSignup, verifyStudentOtp } from "../services/api";


const SignupForm = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // Step 1: signup, Step 2: verify OTP
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [collegeCode, setCollegeCode] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Step 1: Send OTP
  const handleSignup = async (e) => {
    e.preventDefault();
    const result = await studentSignup(name, email, password, collegeCode);
    if (result.message) {
      setMessage(result.message);
      setError("");
      setStep(2); // move to OTP verification
    } else {
      setError(result.error || "Signup failed");
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const result = await verifyStudentOtp(email, otp);
    if (result.message) {
      alert(result.message);
      navigate("/"); // redirect to login
    } else {
      setError(result.error || "OTP verification failed");
    }
  };

  return (
    <div className="login-container">
      {step === 1 && (
        <form className="login-form" onSubmit={handleSignup}>
          <h2>Create Account</h2>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          <input
            type="text"
            placeholder="College Code"
            value={collegeCode}
            onChange={(e) => setCollegeCode(e.target.value)}
            required
          />
          <button type="submit">Sign Up</button>
          {message && <p style={{ color: "green" }}>{message}</p>}
          {error && <p className="error">{error}</p>}
        </form>
      )}

      {step === 2 && (
        <form className="login-form" onSubmit={handleVerifyOtp}>
          <h2>Verify OTP</h2>
          <p>Enter the OTP sent to {email}</p>
          <input
            type="text"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button type="submit">Verify OTP</button>
          {error && <p className="error">{error}</p>}
        </form>
      )}
    </div>
  );
};

export default SignupForm;
