import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const response = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      navigate("/courses");
    } else {
      alert("Login failed");
    }
  };

  const handleGoogleLogin = () => {
    window.open("http://localhost:5000/auth/google", "_self");
  };

  return (
    <div>
      <h2>Sign In</h2>
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br></br>
      <button onClick={handleLogin}>Login</button>
      <br></br>
      <button onClick={handleGoogleLogin}>Login with Google</button>
      <p>
        Don't have an account? <a href="/signup">Create one</a>
      </p>
    </div>
  );
}

export default SignIn;
