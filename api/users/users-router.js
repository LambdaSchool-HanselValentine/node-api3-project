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

	res.json(req.user);

	// //fool proof way:
	// if (!req.user) {
	// 	res.status(req.status).json(req.message);
	// } else {
	// next();
	// }
});

router.post("/", Middleware.validateUser, async (req, res, next) => {
	// RETURN THE NEWLY CREATED USER OBJECT

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

		const changes = { name: req.name };
		const { id } = req.params;
		Users.update(id, changes)
			.then((newData) => {
				res.status(200).json(newData);
			})
			.catch(next);
	},
);

router.delete("/:id", Middleware.validateUserId, async (req, res, next) => {
	// RETURN THE FRESHLY DELETED USER OBJECT

	const { id } = req.params;
	Users.remove(id)
		.then(() => {
			res.status(200).json({ message: "User was removed from database" });
		})
		.catch(next);
});

router.get("/:id/posts", Middleware.validateUserId, async (req, res, next) => {
	// RETURN THE ARRAY OF USER POSTS
	// this needs a middleware to verify user id

	const { id } = req.params;
	Users.getUserPosts(id)
		.then((userPosts) => {
			res.status(200).json(userPosts);
		})
		.catch(next);
});

router.post(
	"/:id/posts",
	Middleware.validateUserId,
	Middleware.validatePost,
	async (req, res, next) => {
		// RETURN THE NEWLY CREATED USER POST

		Posts.insert({
			text: req.body.text,
			user_id: req.user.id,
		})
			.then((newPost) => {
				res.status(201).json(newPost);
			})
			.catch(next);
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
