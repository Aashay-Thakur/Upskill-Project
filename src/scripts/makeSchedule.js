import { db } from "./firebase-config.js";
import { addDoc, Timestamp, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js";

const makeScheduleForm = document.getElementById("make-schedule-form");

makeScheduleForm.addEventListener("submit", (event) => {
	event.preventDefault();

	var today = new Date();

	const subject = makeScheduleForm["subject"].value;
	const teacher = makeScheduleForm["teacher"].value;
	const startTime = makeScheduleForm["start-time"].value;
	const endTime = makeScheduleForm["end-time"].value;
	const joinLink = makeScheduleForm["join-link"].value;

	// Converting simple time string to timestamp so its easier to compare dates
	const startTimeDateString = new Date(today.toLocaleDateString() + " " + startTime);
	const endTimeDateString = new Date(today.toLocaleDateString() + " " + endTime);

	// TODO: Add an option for the user to select the day of the week
	const Data = {
		subject: subject,
		teacher: teacher,
		startTime: Timestamp.fromDate(startTimeDateString),
		endTime: Timestamp.fromDate(endTimeDateString),
		joinLink: joinLink,
		timestamp: Timestamp.now(),
	};

	let queryString1 = where("date", ">=", Timestamp.fromDate(new Date(today.toLocaleDateString() + " " + "00:00:00")));
	let queryString2 = where("date", "<=", Timestamp.fromDate(new Date(today.toLocaleDateString() + " " + "23:59:59")));

	try {
		getDocs(query(collection(db, "college/NKT01/schedule"), queryString1, queryString2)).then((querySnapshot) => {
			if (querySnapshot.docs.length != 0) {
				// if there are schedules for the day, add the new schedule to the end of the list
				// TODO: Check if the new schedule conflicts with any of the existing schedules for the day
				addDoc(collection(db, "college/NKT01/schedule/" + querySnapshot.docs[0].id + "/lecturesScheduled"), Data).then(() => {
					console.log("Lecture scheduled");
				});
			} else {
				// If there are no schedules for the day, add the new schedule
				addDoc(collection(db, "college/NKT01/schedule"), { date: Timestamp.fromDate(startTimeDateString) }).then((docRef) => {
					addDoc(collection(db, "college/NKT01/schedule/" + docRef.id + "/lecturesScheduled"), Data).then(() => {
						console.log("Lecture scheduled");
					});
				});
			}
		});
	} catch (error) {
		console.error(error);
	}
});
