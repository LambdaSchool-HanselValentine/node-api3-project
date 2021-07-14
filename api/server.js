const express = require("express");

const server = express();

// remember express by default cannot parse JSON in request bodies
server.use(express.json());

// global middlewares and the user's router need to be connected here

const helmet = require("helmet");
const morgan = require("morgan");
server.use(helmet());
server.use(morgan("dev"));

const Middleware = require("./middleware/middleware");
const usersRouter = require("./users/users-router");

server.use("/api/users", usersRouter);
server.use(Middleware.logger);

// ! the middlewares should be in the right order

//root handler:
server.get("/", (req, res) => {
	res.send(`<h2>Let's write some middleware!</h2>`);
});

//catch handler:
server.use((req, res, next) => {
	res.status(404).json({ message: "Resource could not be found" });
});

// root error handler middleware =============
server.use((err, req, res, next) => {
	const message = err?.errorMessage || "Something went wrong in the server";
	res.status(500).json({ message });
});

module.exports = server;
