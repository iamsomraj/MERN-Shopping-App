const express = require("express");
const router = express.Router();

// @desc    testing route
// @access  public
// @route   api/users/
router.get("/", (req, res) => {
	res.status(200).json({ message: "Testing the users route" });
});

module.exports = router;
