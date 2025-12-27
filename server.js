const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const connectDB = require("./config/db");
const postRoutes = require("./routes/PostRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 🔥 AUTH ROUTES FIRST
app.use("/api/auth", authRoutes);

// 🔥 THEN PROTECTED / PUBLIC API ROUTES
app.use("/api", postRoutes);

// 🔥 CONNECT DB LAST (important for Render)
connectDB();

app.get("/", (req, res) => {
  res.json({ message: "Backend running successfully" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
