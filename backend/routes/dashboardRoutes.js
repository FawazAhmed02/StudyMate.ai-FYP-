const express = require("express");
const { getDashboardData } = require("../controllers/dashboardController");

const router = express.Router();

// Update the route to include userId as a URL parameter
router.get("/dashboard-data/:userId", getDashboardData);

module.exports = router;