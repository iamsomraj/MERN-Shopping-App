const express = require("express");
const router = express.Router();

// @desc    testing route
// @access  public
// @route   api/products/
router.get("/", (req, res) => {
	res.status(200).json({ message: "Testing the products route" });
});

module.exports = router;
