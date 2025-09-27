const express = require("express");
const router = express.Router();
const multer = require("multer");
const financialController = require("../Controllers/financial_records");

// Multer in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @swagger
 * /finances/{userId}/{year}:
 *   get:
 *     summary: Get user finances for a given year
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of financial records
 *       404:
 *         description: No records found
 */
router.get("/finances/:userId/:year", financialController.getUserFinancesByYear);

/**
 * @swagger
 * /finances/upload/{userId}/{year}:
 *   post:
 *     summary: Upload Excel file with financial records
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Excel data imported successfully
 *       400:
 *         description: No file uploaded
 */
router.post(
  "/finances/upload/:userId/:year",
  upload.single("file"),
  financialController.uploadFinancialRecords
);

module.exports = router;
