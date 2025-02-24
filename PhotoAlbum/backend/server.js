const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads")); // Serve images

// Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL database");
});

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Routes
app.get("/photos", (req, res) => {
    db.query("SELECT * FROM photos", (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.post("/photos", upload.single("image"), (req, res) => {
    const { title } = req.body;
    const imageUrl = `http://localhost:${process.env.PORT}/uploads/${req.file.filename}`;

    db.query("INSERT INTO photos (title, image_url) VALUES (?, ?)", [title, imageUrl], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ id: results.insertId, title, image_url: imageUrl });
    });
});

app.delete("/photos/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM photos WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Photo deleted successfully" });
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
 