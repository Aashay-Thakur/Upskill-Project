const path = require("path");
const axios = require("axios");

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const { getAuth } = require("firebase-admin/auth");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

// create a server
const express = require("express");
const { ContextExclusionPlugin } = require("webpack");
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

app.get("/send", function (req, res) {
	let uid = "LnXlseuRmBhvEW7yds2wiaxfuM13";
	getAuth()
		.setCustomUserClaims(uid, { teacher: true })
		.then(() => console.log("Claims set"));
});

app.get("/schedule", function (req, res) {
	res.sendFile("views/schedule.html", { root: rootPath });
});

app.get("/login", function (req, res) {
	res.sendFile("views/signin.html", { root: rootPath });
});

app.get("/register", function (req, res) {
	res.sendFile("views/register.html", { root: rootPath });
});

app.get("/make-schedule", function (req, res) {
	res.sendFile("views/make-schedule.html", { root: rootPath });
});

app.get("/create-notice", function (req, res) {
	res.sendFile("views/create-notice.html", { root: rootPath });
});

app.get("/calendar", function (req, res) {
	res.sendFile("views/calendar.html", { root: rootPath });
});

app.get("/day-schedule", function (req, res) {
	res.sendFile("views/day-schedule.html", { root: rootPath });
});

// Static files
app.use("/static", express.static("dist/static"));
