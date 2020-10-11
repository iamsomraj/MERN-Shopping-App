import User from "../../models/User.js";
import asyncHandler from "express-async-handler";

// @desc    delete user by id
// @access  private
// @route   DELETE /api/users/:id
const deleteUserByAdmin = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);
	if (user) {
		await user.remove();
		res.status(200).json({ message: "User removed" });
	} else {
		const message = "User unavailable";
		res.status(404).json({ message });
		throw new Error(message);
	}
});

export default deleteUserByAdmin;
