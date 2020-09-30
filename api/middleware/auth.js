require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	const token = req.header("x-auth-token");

	if (!token) {
		return res.status(401).json({ msg: "No token, authorization denied" });
	}

	try {
		const decoded = jwt.verify(token, process.env.SECRET);
		req.user = decoded.user;
		next();
	} catch (err) {
		console.log("Token is invalid");
		res.status(401).json({ errors: [{ msg: "Token is invalid" }] });
	}
};
