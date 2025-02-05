const express = require("express");
const router = express.Router();
const initializeDatabase = require("../utils/databaseInit");

// Expose `/init` API route
router.post("/", async (req, res) => {
    try {
        await initializeDatabase();
        res.status(200).json({ success: true, message: "Database initialized successfully." });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;