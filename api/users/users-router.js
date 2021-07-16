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
			res.status(500).json({ message: "error fetching users" });
		});
});

router.get("/:id", Middleware.validateUserId, (req, res) => {
	// RETURN THE USER OBJECT
	// this needs a middleware to verify user id

	res.json(req.user);

	// //fool proof way:
	// if (!req.user) {
	// 	res.status(req.status).json(req.message);
	// } else {
	// 	res.status(200).json(req.user);
	// }
});

router.post("/", Middleware.validateUser, async (req, res, next) => {
	// RETURN THE NEWLY CREATED USER OBJECT
	// this needs a middleware to check that the request body is valid

	Users.insert({ name: req.name })
		.then((newUser) => {
			res.status(200).json(newUser);
		})
		.catch(next);
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
//Always come at the end
//Users-Router error handler:
router.use((err, req, res, next) => {
	const message = err?.message || "Something went wrong in the Users router";
	const status = err?.status || 500;
	res.status(`${status}`).json({ message, stack: err.stack });
});

// do not forget to export the router
module.exports = router;
