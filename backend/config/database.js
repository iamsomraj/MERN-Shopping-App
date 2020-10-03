import mongoose from "mongoose";

const connectToDatabase = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGODB_URI, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
			useCreateIndex: true,
		});
		console.log(`Database is connected`.yellow.underline.bold);
	} catch (error) {
		console.error(`Error: ${error.message}`.red.underline.bold);
	}
};

export default connectToDatabase;
