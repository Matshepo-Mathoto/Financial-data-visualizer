const express = require('express');
const mysql = require('mysql2');
const xlsx = require('xlsx');
const app = express();
const port = 3000;

// Create a persistent connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Password@1',
    database: 'financial'
});

// Enable JSON parsing
app.use(express.json());

// Connect once at startup
connection.connect(err => {
    if (err) {
        console.error('DB connection failed:', err);
    } else {
        console.log('DB connected');
    }
});

// Route
app.get('/api/finances/:userId/:year', async (req, res) => {
    const { userId, year } = req.params;

    try {
        const [results] = await connection
            .promise()
            .query('SELECT * FROM financial_record WHERE userId = ? AND year = ?', [userId, year]);

        console.log('Query results:', results);
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

app.post('/api/finances/upload/:userId/:year', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        // Read Excel file
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0]; // first sheet
        const sheet = workbook.Sheets[sheetName];

        // Multer memory storage
        const storage = multer.memoryStorage();
        const upload = multer({ storage });

        // Convert sheet to JSON
        const rows = xlsx.utils.sheet_to_json(sheet);

        // Insert rows into MySQL
        for (const row of rows) {
            // Example: adjust column names to your table
            await db.query(
                'INSERT INTO financial_record (userId, year,month, amount) VALUES (?, ?, ?, ?, ?)',
                [userId, year, row.month, row.amount]
            );
        }
        res.json({ message: 'Excel data imported successfully', rowsInserted: rows.length });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to import Excel data' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
