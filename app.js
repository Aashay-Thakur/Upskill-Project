const path = require("path");

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");
var bodyParser = require("body-parser");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

const db = getFirestore();

// create a server
const express = require("express");
const app = express();

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

app.post("/setCustomClaims", async (req, res) => {
	// Get the ID token passed.
	var { uid, isTeacher } = req.body;
	if (!uid) {
		res.status(400).send("Invalid Request");
		return;
	} else if (isTeacher) {
		await getAuth().setCustomUserClaims(uid, { isTeacher: true });
		res.status(200).send("Success");
	} else if (!isTeacher) {
		await getAuth().setCustomUserClaims(uid, { isTeacher: false });
		res.status(200).send("Success");
	}
});

// app.post("/checkCustomClaims", function (req, res) {
// 	let { uid } = req.body;
// 	getAuth()
// 		.getUser(uid)
// 		.then((userRecords) => {
// 			res.send(userRecords.customClaims);
// 		});
// });

app.get("/schedule", function (req, res) {
	res.sendFile("views/schedule.html", { root: rootPath });
});

app.get("/login", function (req, res) {
	res.sendFile("views/login.html", { root: rootPath });
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

app.post("/checkCode", async function (req, res) {
	const code = req.body.code;
	var teacherDoc = await db.collection("college").where("teacherCode", "==", code).get();
	if (!teacherDoc.empty) res.send(JSON.stringify({ isTeacher: true }));
	else {
		var studentDoc = await db.collection("college/NKT01/classes").where("classCode", "==", code).get();
		if (!studentDoc.empty) res.send(JSON.stringify({ isTeacher: false }));
		else res.status(403).json({ status: "error", message: "Code not found" });
	}
});

// Static files
app.use("/static", express.static("dist/static"));
