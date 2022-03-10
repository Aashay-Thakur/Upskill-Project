import { auth, db } from "./firebase-config.js";
import { collection, getDocs, where, query, Timestamp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js";

// getDocs(query(collection(db, "college/NKT01/schedule"), orderBy("date", "desc"), limit(1))).then((querySnapshot) => {
// 	querySnapshot.forEach((doc) => {
// 		getDocs(collection(db, "college/NKT01/schedule/" + doc.id + "/lecturesScheduled")).then((scheduleSnap) => {
// 			scheduleSnap.forEach((lecture) => {
// 				renderSchedules(lecture.data());
// 			});
// 		});
// 	});
// });

var today = new Date();

var query1 = where("date", ">=", Timestamp.fromDate(new Date(today.toLocaleDateString() + " " + "00:00:00")));
var query2 = where("date", "<=", Timestamp.fromDate(new Date(today.toLocaleDateString() + " " + "23:59:59")));
getDocs(query(collection(db, "college/NKT01/schedule"), query1, query2)).then((querySnapshot) => {
	let docId = querySnapshot.docs[0].id;
	getDocs(collection(db, "college/NKT01/schedule/" + docId + "/lecturesScheduled")).then((scheduleSnap) => {
		scheduleSnap.forEach((lecture) => {
			renderSchedules(lecture.data());
		});
	});
});
