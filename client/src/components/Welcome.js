import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

function Welcome() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome to Our App</h1>
      <h2>Learn Free Courses and Enjoy Your journey</h2>

      <button onClick={() => navigate("/signin")}>Sign In</button>
    </div>
  );
}

export default Welcome;
