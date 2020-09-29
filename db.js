require("dotenv").config();
const mongoose = require("mongoose");
const db = process.env.MONGODB_URI;

const connectDB = async () => {
	try {
		await mongoose.connect(db, {
			useCreateIndex: true,
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log(`Database connection is succesfully established`);
	} catch (error) {
		console.log(`Database connection : FAIL : Exiting Process...`);
		process.exit(1);
	}
};

module.exports = connectDB;
