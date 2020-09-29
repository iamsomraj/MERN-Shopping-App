const express = require("express");
const router = express.Router();

// @desc    testing route
// @access  public
// @route   api/auth/
router.get("/", (req, res) => {
	res.status(200).json({ message: "Testing the auth route" });
});

module.exports = router;
