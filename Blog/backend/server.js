const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

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

// Routes
app.get("/posts", (req, res) => {
    db.query("SELECT * FROM posts", (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.post("/posts", (req, res) => {
    const { title, content } = req.body;
    db.query("INSERT INTO posts (title, content) VALUES (?, ?)", [title, content], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ id: results.insertId, title, content });
    });
});

app.put("/posts/:id", (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    db.query("UPDATE posts SET title = ?, content = ? WHERE id = ?", [title, content, id], (err) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Post updated successfully" });
    });
});

app.delete("/posts/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM posts WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Post deleted successfully" });
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
