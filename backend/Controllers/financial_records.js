const xlsx = require("xlsx");
const db = require("../config/dbConfig"); // MySQL connection

// Get all financial records for a user in a given year
exports.getUserFinancesByYear = async (req, res) => {
  const { userId, year } = req.params;

  try {
    const [results] = await db.promise().query(
      `SELECT fr.*, u.name
  FROM financial_record fr
  LEFT JOIN users u ON fr.userId = u.id
  WHERE fr.userId = ? AND fr.year = ?`,
      [userId, year]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: "No records found" });
    }
    const response = {
      username: results[0]?.name || "Unknown",
      year: year,
      records: results.map(r => ({
        month: r.month,
        amount: r.amount,
        record_id: r.record_id
      }))
    };

    res.status(200).json(response);
  } catch (err) {
    console.error("Database query failed:", err);
    res.status(500).json({ error: "Database query failed" });
  }
};

// Upload Excel file and import financial records
exports.uploadFinancialRecords = async (req, res) => {
  const { userId, year } = req.params;

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    // Read Excel file directly from buffer
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rows = xlsx.utils.sheet_to_json(sheet);

    // Bulk insert instead of looping for performance
    if (rows.length > 0) {
      const values = rows.map((row) => [userId, year, row.Month, row.Amount]);
      await db
        .promise()
        .query(
          "INSERT INTO financial_record (userId, year, month, amount) VALUES ?",
          [values]
        );
    }

    res.json({
      message: "Excel data imported successfully",
      rowsInserted: rows.length,
    });
  } catch (err) {
    console.error("Excel import error:", err);
    res.status(500).json({ error: "Failed to import Excel data" });
  }
};
