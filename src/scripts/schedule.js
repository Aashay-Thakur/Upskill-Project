import { auth, db } from "./firebase-config.js";
import { collection, getDocs, where, query, Timestamp } from "firebase/firestore";

document.addEventListener("DOMContentLoaded", function () {
	var elems = document.querySelectorAll(".collapsible");
	var instances = M.Collapsible.init(elems, {});
});

var today = new Date();

var query1 = where("date", ">=", Timestamp.fromDate(new Date(today.toLocaleDateString() + " " + "00:00:00")));
var query2 = where("date", "<=", Timestamp.fromDate(new Date(today.toLocaleDateString() + " " + "23:59:59")));
getDocs(query(collection(db, "college/NKT01/schedule"), query1, query2)).then((querySnapshot) => {
	if (querySnapshot.docs.length != 0) {
		let docId = querySnapshot.docs[0].id;
		getDocs(collection(db, "college/NKT01/schedule/" + docId + "/lecturesScheduled")).then((scheduleSnap) => {
			scheduleSnap.forEach((lecture) => {
				renderSchedules(lecture.data());
			});
		});
	}
});
