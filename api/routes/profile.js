const express = require("express");
const router = express.Router();

// @desc    testing route
// @access  public
// @route   api/profile/
router.get("/", (req, res) => {
	res.status(200).json({ message: "Testing the profile route" });
});

module.exports = router;
