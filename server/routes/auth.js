const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models/User");
const jwt = require("jsonwebtoken");


const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    console.log("Signup request received:", req.body); 

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    console.log("Hashing password..."); 
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      googleId: null 
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  console.log("✅ Hit the /auth/login route");
  console.log("📦 Request body received:", req.body);

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("❌ Missing credentials");
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Password incorrect");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});

router.get("/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));

router.get("/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/login-failure",
    session: true
  }),
  (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "Strict" });

   
    res.redirect("http://localhost:3000/Courses");
  }
 

);
  

router.get("/login-failure", (req, res) => {
  res.status(401).json({ message: "Failed to login with Google" });
});


router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: "Logout failed", error: err });
        }
        req.session.destroy(() => {
            res.clearCookie("connect.sid");
            res.status(200).json({ message: "Logged out successfully" });
        });
    });
});

module.exports = router;
