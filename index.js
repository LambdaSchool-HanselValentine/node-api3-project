// require your server and launch it

// require("dotenv").config();
// const server = require("./api/server");
// const port = process.env.PORT;
// server.listen(port, () => {
// 	console.log(`*** listening on port:${port} ****`);
// });

const server = require("./api/server");

server.listen(4000, () => {
	console.log("\n* Server Running on http://localhost:4000 *\n");
});
