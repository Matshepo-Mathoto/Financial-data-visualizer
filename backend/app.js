const express = require("express");
const app = express();

const financialRoutes = require("./routes/financial-records-outer");

// Middleware
app.use(express.json());

// Routes
app.use("/api", financialRoutes);

// Error handler (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

module.exports = app;
