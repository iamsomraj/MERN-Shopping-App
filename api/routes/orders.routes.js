const express = require("express");
const router = express.Router();

// @desc    testing route
// @access  public
// @route   api/orders/
router.get("/", (req, res) => {
	res.status(200).json({ message: "Testing the orders route" });
});

module.exports = router;
