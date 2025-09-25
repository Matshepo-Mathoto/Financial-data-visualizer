const express = require("express");
const router = express.Router();
const multer = require("multer");
const financialController = require("../Controllers/financial_records");

// Multer in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.get("/finances/:userId/:year", financialController.getUserFinancesByYear);
router.post(
  "/finances/upload/:userId/:year",
  upload.single("file"),
  financialController.uploadFinancialRecords
);

module.exports = router;
