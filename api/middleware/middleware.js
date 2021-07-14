// ! dont forget the import of our data
const User = require("../users/users-model");

function logger(req, res, next) {
	// logger logs to the console the following information about each request: request method, request url, and a timestamp
	// this middleware runs on every request made to the API
	const method = req.method;
	const url = req.url;
	const time = new Date().toLocaleDateString("en-US");

	console.log(`
  ${time} // ${method} request to ${url}
  `);
	next();
}

function validateUserId(req, res, next) {
	// 	this middleware will be used for all user endpoints that include an id parameter in the url (ex: /api/users/:id and it should check the database to make sure there is a user with that id.
	// if the id parameter is valid, store the user object as req.user and allow the request to continue
	// if the id parameter does not match any user id in the database, respond with status 404 and { message: "user not found" }
	const { id } = req.params;
	User.getById(id)
		.then((id) => {
			if (id) {
				req.user = user;
				next();
			} else {
				next({ errorMessage: "User not found" });
			}
		})
		.catch(next({ errorMessage: "There's an error validating the user" }));
}

function validateUser(req, res, next) {
	// 	validateUser validates the body on a request to create or update a user
	// if the request body lacks the required name field, respond with status 400 and { message: "missing required name field" }
}

function validatePost(req, res, next) {
	// 	validatePost validates the body on a request to create a new post
	// if the request body lacks the required text field, respond with status 400 and { message: "missing required text field" }
}

// do not forget to expose these functions to other modules
module.exports = {
	logger,
	validateUser,
	validateUserId,
	validatePost,
};
