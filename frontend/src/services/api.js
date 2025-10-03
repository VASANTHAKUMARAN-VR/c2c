const BASE_URL = "https://c2c-4fy4.onrender.com/api/auth";

export const loginUser = async (email, password) => {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return await res.json();
  } catch (err) {
    return { error: "Server Error", err };
  }
};

export const sendOtp = async (email) => {
  try {
    const res = await fetch(`${BASE_URL}/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return await res.json();
  } catch (err) {
    return { error: "Server Error", err };
  }
};

export const resetPassword = async (email, otp, newPassword) => {
  try {
    const res = await fetch(`${BASE_URL}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, newPassword }),
    });
    return await res.json();
  } catch (err) {
    return { error: "Server Error", err };
  }
};

export const studentSignup = async (name, email, password, collegeCode) => {
  try {
    const res = await fetch(`${BASE_URL}/student/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, collegeCode }),
    });
    return await res.json();
  } catch (err) {
    return { error: "Server Error", err };
  }
};

export const verifyStudentOtp = async (email, otp) => {
  try {
    const res = await fetch(`${BASE_URL}/student/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    return await res.json();
  } catch (err) {
    return { error: "Server Error", err };
  }
};
