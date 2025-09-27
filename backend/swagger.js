const express = require("express");
const app = express();
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const financeRoutes = require("./routes/financialRoutes");

// Swagger config
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Financial Records API",
      version: "1.0.0",
      description: "API for managing financial records",
    },
    servers: [
      {
        url: "http://localhost:5000", // change if using another port
      },
    ],
  },
  apis: ["./Routers/*.js"], // path to your route files with Swagger comments
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

// Middleware
app.use(express.json());

// Swagger UI route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Your routes
app.use("/api", financeRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the Financial Records API. Visit /api-docs for docs.");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
