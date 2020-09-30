const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

// @desc    testing route
// @access  public
// @route   api/auth/
router.get("/", auth, (req, res) => {
	res.status(200).json({ message: "User is verified", user: req.user });
});

module.exports = router;
