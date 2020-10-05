import path from "path";
import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import morgan from "morgan";
import connectToDatabase from "./config/database.js";
import { errorHandler, pageNotFound } from "./middlewares/errorMiddleware.js";

dotenv.config();

connectToDatabase();

const app = express();

if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

app.use(express.json());

const MODE = process.env.NODE_ENV;
const PORT = process.env.PORT || 4500;

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

if (process.env.NODE_ENV === "production") {
	// @TODO : Handle Requests
} else {
	app.get("/", (req, res) => {
		res.send("Our Express API is running..");
	});
}

app.use(pageNotFound);
app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server running in ${MODE} mode on port ${PORT}`.yellow.bold);
});
