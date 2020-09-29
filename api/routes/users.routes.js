const express = require("express");
const router = express.Router();

// @desc    registering a new user
// @access  public
// @route   api/users/
router.post("/", (req, res) => {
	res.status(200).json({ message: "Testing the users route" });
});

module.exports = router;
