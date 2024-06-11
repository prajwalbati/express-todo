const express = require("express");

const router = express.Router();

router.get("/profile", (req, res) => {
    return res.json({fullName: req.user.full_name, email: req.user.email});
});

module.exports = router;