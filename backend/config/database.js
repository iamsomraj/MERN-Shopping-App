import mongoose from "mongoose";
import colors from "colors";

const connectToDatabase = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log(`Database is connected`.yellow.underline.bold);
	} catch (error) {
		console.error(`Error: ${error.message}`.red.underline.bold);
	}
};

export default connectToDatabase;
