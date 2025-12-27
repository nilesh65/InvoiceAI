require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const connectDB = require("./config/db");
const authRoutes = require('./routes/authRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

// Middleware to handle CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Connect Database
connectDB();

// Middleware
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/ai", aiRoutes);

// Serve React frontend
const frontendPath = path.join(__dirname, "../frontend/invoice-generator/dist");
app.use(express.static(frontendPath));

// Serve React for non-API routes (safe alternative to app.get('*'))
app.use((req, res, next) => {
  if (!req.path.startsWith("/api")) {
    const indexHtml = path.join(frontendPath, "index.html");
    if (fs.existsSync(indexHtml)) {
      res.sendFile(indexHtml);
      return;
    }
  }
  next();
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
