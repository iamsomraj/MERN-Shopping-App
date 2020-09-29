require("dotenv").config();

const express = require("express");
const connectDB = require("./db");

const usersRoute = require("./api/routes/users");
const ordersRoute = require("./api/routes/orders");
const authRoute = require("./api/routes/auth");
const profileRoute = require("./api/routes/profile");
const productsRoute = require("./api/routes/products");

const app = express();

// connect to database
connectDB();

// api routes
app.use("/api/users", usersRoute);
app.use("/api/auth", authRoute);
app.use("/api/orders", ordersRoute);
app.use("/api/profile", profileRoute);
app.use("/api/products", productsRoute);

const PORT = process.env.PORT || 4500;

app.listen(PORT, () => {
	console.log(`Express server is listening on the port ${PORT}`);
});
