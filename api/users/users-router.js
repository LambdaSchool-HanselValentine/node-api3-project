const express = require("express");

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required
const Users = require("./users-model");
const Posts = require("../posts/posts-model");
const Middleware = require("../middleware/middleware");

const router = express.Router();

router.get("/", (req, res) => {
	// RETURN AN ARRAY WITH ALL THE USERS
	Users.get()
		.then((users) => {
			res.status(200).json(users);
		})
		.catch(() => {
			res.status(500).json({ message: "error in users-router GET /" });
		});
});

router.get("/:id", Middleware.validateUserId, (req, res) => {
	// RETURN THE USER OBJECT
	// this needs a middleware to verify user id

	//? don't need to invoke .getByUserId() anymore because we already invoked that in our middleware
	try {
		if (req.user) {
			res.status(200).json(req.user);
		} else {
			res.status(req.status).json(req.errorMessage);
		}
	} catch {
		res.status(500).json({ message: "error in users-router GET /:id" });
	}
});

router.post("/", Middleware.validateUser, async (req, res) => {
	// RETURN THE NEWLY CREATED USER OBJECT
	// this needs a middleware to check that the request body is valid
	const { body } = req.body;
	try {
		const newUser = await Users.insert(body);
		if (newUser) {
			res.status(201).json(newUser);
		} else {
			res.status(req.status).json(req.errorMessage);
		}
	} catch {
		res.status(500).json({ message: "error in users-router POST /" });
	}
});

router.put(
	"/:id",
	Middleware.validateUserId,
	Middleware.validateUser,
	async (req, res, next) => {
		// RETURN THE FRESHLY UPDATED USER OBJECT
		// this needs a middleware to verify user id
		// and another middleware to check that the request body is valid
		try {
			const changes = req.body;
			const { id } = req.params;
			const updatedUser = await Users.update(id, changes);
			res.status(200).json(changes);
		} catch {
			res.status(500).json({ message: "error in users-router PUT /:id" });
		}
	},
);

router.delete("/:id", Middleware.validateUserId, async (req, res) => {
	// RETURN THE FRESHLY DELETED USER OBJECT
	// this needs a middleware to verify user id
	try {
		const { id } = req.params;
		const removedId = await Users.remove(id);
		res.status(200).json({ message: "User was removed from database" });
	} catch (err) {
		res.status(500).json({ message: "error in users-router in DELETE /:id" });
	}
});

router.get("/:id/posts", Middleware.validateUserId, async (req, res) => {
	// RETURN THE ARRAY OF USER POSTS
	// this needs a middleware to verify user id
	try {
		const { id } = req.params;
		const usersPosts = await Users.getUserPosts(id);
		res.status(200).json(usersPosts);
	} catch (err) {
		res.status(500).json({ message: "error in users-router GET /:id/posts" });
	}
});

router.post(
	"/:id/posts",
	Middleware.validateUserId,
	Middleware.validatePost,
	async (req, res) => {
		// RETURN THE NEWLY CREATED USER POST
		// this needs a middleware to verify user id
		// and another middleware to check that the request body is valid
		try {
			const newPost = await Posts.insert({
				text: req.body.text,
				user_id: req.user.id,
			});

			res.status(201).json(newPost);
		} catch (err) {
			res.status(500).json({ message: "error in users-router POST /:id/post" });
		}
	},
);

// =============
//
//Users-Router error handler:
router.use((err, req, res, next) => {
	const message =
		err?.errorMessage || "Something went wrong in the Users router";
	const status = err?.status || 500;
	res.status(`${status}`).json({ message });
});

// do not forget to export the router
module.exports = router;
