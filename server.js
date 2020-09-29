require("dotenv").config();

const express = require("express");
const connectDB = require("./db");

const usersRoute = require("./api/routes/users.routes");
const ordersRoute = require("./api/routes/orders.routes");
const authRoute = require("./api/routes/auth.routes");
const profileRoute = require("./api/routes/profile.routes");
const productsRoute = require("./api/routes/products.routes");

const app = express();

// connect to database
connectDB();

// middlewares
app.use(express.json());

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
