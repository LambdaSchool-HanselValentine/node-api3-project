const User = require("../users/users-model");

function logger(req, res, next) {
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
	const { id } = req.params;
	try {
		const user = await User.getById(id);
		if (!user) {
			res.status(404).json({ message: "user not found" });
		} else {
			req.user = user;
			next();
		}
	} catch (err) {
		res
			.status(500)
			.json({ message: "There's an error validating the user ID" });
	}
}

function validateUser(req, res, next) {
	const { name } = req.body;
	try {
		if (!name || Object.keys(name).length === 0) {
			res.status(400).json({ message: "missing required name field" });
		} else {
			req.name = name.trim(); //to remove the before & after whitespaces
			next();
		}
	} catch {
		res.status(500).json({ message: "There's an error validating the user" });
	}
}

function validatePost(req, res, next) {
	const { text } = req.body;
	try {
		if (!text || Object.keys(text).length === 0) {
			res.status(400).json({ message: "missing required text field" });
		} else {
			res.text = text.trim();
			next();
		}
	} catch {
		next({ message: "There's an error validating the Post", status: 500 });
	}
}

module.exports = {
	logger,
	validateUser,
	validateUserId,
	validatePost,
};
