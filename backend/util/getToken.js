import jwt from "jsonwebtoken";

const getToken = (id) => {
	return jwt.sign({ id }, process.env.SECRET, {
		expiresIn: "5d",
	});
};

export default getToken;
