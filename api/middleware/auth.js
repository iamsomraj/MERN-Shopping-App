require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	const token = req.header("x-auth-token");

	if (!token) {
		return res.status(401).json({ msg: "No token, authorization denied" });
	}

	try {
		jwt.verify(token, process.env.SECRET, (error, decoded) => {
			if (error) {
				return res
					.status(401)
					.json({ errors: [{ msg: "Token is not valid" }] });
			} else {
				req.user = decoded.user;
				next();
			}
		});
	} catch (err) {
		res.status(500).json({ errors: [{ msg: "Internal Server Error" }] });
	}
};
