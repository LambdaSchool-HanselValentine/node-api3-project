const express = require("express");
const server = express();

// remember express by default cannot parse JSON in request bodies
server.use(express.json());

// global middlewares and the user's router need to be connected here
// const helmet = require("helmet");
// const morgan = require("morgan");
// server.use(helmet());
// server.use(morgan("dev"));

const { logger } = require("./middleware/middleware");
const usersRouter = require("./users/users-router");

// ! the middlewares should be in the right order
// ! it is important logger comes first because it has to go thru the usersRouter
server.use(logger);
server.use("/api/users", usersRouter);

//root handler:
server.get("/", (req, res) => {
	res.send(`<h2>Let's write some middleware!</h2>`);
});

//catch handler:
server.use((req, res, next) => {
	res.status(404).json({
		message:
			"There's an error somewhere. Check your request method, check our url, idk. Fix it Hansel!",
	});
});

// root error handler middleware =============
server.use((err, req, res, next) => {
	const message = err?.errorMessage || "Something went wrong in the server";
	res.status(500).json({ message });
});

module.exports = server;
