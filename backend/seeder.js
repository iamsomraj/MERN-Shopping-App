import dotenv from "dotenv";
import colors from "colors";
import users from "./data/users.js";
import connectDB from "./config/database.js";
import Order from "./models/Order.js";
import User from "./models/User.js";
import Product from "./models/Product.js";

dotenv.config();

connectDB();

const importData = async () => {
	try {
		await Order.deleteMany();
		await Product.deleteMany();
		await User.deleteMany();
		await User.insertMany(users);
		console.log("Data is added!".green.bold);
		process.exit();
	} catch (error) {
		console.error(`${error}`.red);
		process.exit(1);
	}
};

const destroyData = async () => {
	try {
		await Order.deleteMany();
		await Product.deleteMany();
		await User.deleteMany();
		console.log("Data is deleted!".cyan.bold);
		process.exit();
	} catch (error) {
		console.error(`${error}`.red);
		process.exit(1);
	}
};

if (process.argv[2] === "-d") {
	destroyData();
} else {
	importData();
}
