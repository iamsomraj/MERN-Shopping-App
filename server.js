require("dotenv").config();

const express = require("express");

const app = express();

app.get("/", (req, res) => {
	res.status(200).json({ message: "Express Server API" });
});

const PORT = process.env.PORT || 4500;

app.listen(PORT, () => {
	console.log(`Express server is listening on the port ${PORT}`);
});