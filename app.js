const path = require("path");

// create a server
const express = require("express");
const app = express();

// listen to port 3000
app.listen(3000, function () {
	console.log("listening on port 3000 => http://localhost:3000");
});

// Root path
const rootPath = path.join(__dirname, "dist");

// Routing
app.get("/", function (req, res) {
	res.sendFile("views/index.html", { root: rootPath });
});

app.get("/schedule", function (req, res) {
	res.sendFile("views/schedule.html", { root: rootPath });
});

app.get("/login", function (req, res) {
	res.sendFile("views/login.html", { root: rootPath });
});

app.get("/login", function (req, res) {
	res.sendFile("views/signup.html", { root: rootPath });
});

app.get("/make-schedule", function (req, res) {
	res.sendFile("views/make-schedule.html", { root: rootPath });
});

app.get("/create-notice", function (req, res) {
	res.sendFile("views/create-notice.html", { root: rootPath });
});

// Send calendar.js on /calendar
app.get("/calendar", function (req, res) {
	res.sendFile("views/calendar.html", { root: rootPath });
});

// Static files
app.use("/static", express.static("dist/static"));
