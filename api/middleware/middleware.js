// ! dont forget the import of our data
const User = require("../users/users-model");

function logger(req, res, next) {
	// logger logs to the console the following information about each request: request method, request url, and a timestamp
	// this middleware runs on every request made to the API
	const method = req.method;
	const url = req.url;
	const timeStamp = new Date().toLocaleDateString("en-US");

	console.log(`
  ${timeStamp} || ${method} request to ${url}
  `);
	next();
}

// const validateUserId = async (req, res, next) => {
async function validateUserId(req, res, next) {
	// 	this middleware will be used for all user endpoints that include an id parameter in the url (ex: /api/users/:id and it should check the database to make sure there is a user with that id.
	// if the id parameter is valid, store the user object as req.user and allow the request to continue
	// if the id parameter does not match any user id in the database, respond with status 404 and { message: "user not found" }
	const { id } = req.params;
	try {
		const user = await User.getById(id);
		if (user) {
			req.user = user;
			next();
		} else {
			next({ errorMessage: "user not found", status: 404 });
		}
	} catch (err) {
		next({
			errorMessage: "There's an error validating the user ID",
			status: 500,
		});
	}
}

function validateUser(req, res, next) {
	// 	validateUser validates the body on a request to create or update a user
	// if the request body lacks the required name field, respond with status 400 and { message: "missing required name field" }
	const { name } = req.body;
	try {
		if (!name || Object.keys(name).length === 0) {
			next({ errorMessage: "missing required name field", status: 400 });
		} else {
			next();
		}
	} catch {
		next({ errorMessage: "There's an error validating the user", status: 500 });
	}
}

function validatePost(req, res, next) {
	// 	validatePost validates the body on a request to create a new post
	// if the request body lacks the required text field, respond with status 400 and { message: "missing required text field" }
	const { body } = req.body;
	try {
		if (body && body.length > 0) {
			next();
		} else {
			next({ errorMessage: "missing required text field" });
		}
	} catch {
		next({ errorMessage: "There's an error validating the Post", status: 500 });
	}
}

// do not forget to expose these functions to other modules
module.exports = {
	logger,
	validateUser,
	validateUserId,
	validatePost,
};
