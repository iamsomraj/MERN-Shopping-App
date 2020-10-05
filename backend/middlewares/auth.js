import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

const userAuth = asyncHandler(async (req, res, next) => {
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
			const token = req.headers.authorization.split(" ")[1];
			if (!token) {
				return res.status(400).json({ message: "No token found" });
			}
			const decoded = jwt.verify(token, process.env.SECRET);
			req.user = await User.findById(decoded.id).select("-password");
			next();
		} catch (error) {
			const message = "Unauthorized User Access";
			res.status(401).json({ message });
			throw new Error(message);
		}
	}
});

const adminAuth = (req, res, next) => {
	if (req.user && req.user.isAdmin) {
		next();
	} else {
		const message = "Unauthorized Admin Access";
		res.status(401).json({ message });
		throw new Error(message);
	}
};

export { userAuth, adminAuth };
