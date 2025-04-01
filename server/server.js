const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const session = require('express-session');
const MongoStore = require('connect-mongo'); 
require("dotenv").config();
require("./middlewares/passport"); 

const authRoutes = require("./routes/auth");

const app = express();
app.use(express.json());
app.use(cors());

app.use(session({
  secret: process.env.JWT_SECRET,  
  resave: false,
  saveUninitialized: false,  
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }), 
  cookie: {
    secure: false, 
    httpOnly: true, 
    maxAge: 1000 * 60 * 60 * 24 
  }
}));


app.use(passport.initialize());
app.use(passport.session()); 

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => console.log("MongoDB Connected"));
mongoose.connection.on("error", (err) => console.error("MongoDB connection error:", err));

app.use("/auth", authRoutes);
app.get("/welcome", (req, res) => {
  res.send("Welcome to the app!");
});

const PORT = process.env.PORT || 5000;
app.listen(5000, () => console.log(`Server running on port 5000`));
