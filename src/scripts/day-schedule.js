import { getFirestore, getDoc, getDocs, where, Timestamp, query, collection } from "firebase/firestore";
import moment from "moment";

if (location.pathname == "/day-schedule") {
	const db = getFirestore();

	const schedulList = document.querySelector("#schedule-list");

	document.addEventListener("DOMContentLoaded", function () {
		var elems = document.querySelectorAll(".collapsible");
		var instances = M.Collapsible.init(elems, { accordion: false });
	});

	let dateQuery;

	if (/\?date=\d{1,2}-\d{1,2}-\d{1,2}/.test(location.search)) {
		dateQuery = new Date(/^\?date=(.*)$/g.exec(window.location.search)[1]);
	} else {
		dateQuery = new Date();
	}

	var query1 = where("date", ">=", Timestamp.fromDate(new Date(dateQuery.toLocaleDateString() + " " + "00:00:00")));
	var query2 = where("date", "<=", Timestamp.fromDate(new Date(dateQuery.toLocaleDateString() + " " + "23:59:59")));

	getDocs(query(collection(db, "college/NKT01/schedule"), query1, query2)).then((docSnapshot) => {
		let docId = docSnapshot.docs[0].id;
		getDocs(collection(db, "college/NKT01/schedule/" + docId + "/lecturesScheduled")).then((scheduleSnap) => {
			scheduleSnap.forEach((lecture) => {
				if (lecture.data()) {
					let data = lecture.data();
					let startTime = moment(data.startTime.toDate()).format("LT");

					let templateString = `
						<li>
							<div class="collapsible-header schedule-item">
								<div><p>${data.subject}</p></div>
							</div>
							<div class="collapsible-body"><span>Lorem ipsum dolor sit amet.</span></div>
						</li>
					`;

					schedulList.insertAdjacentHTML("beforeend", templateString);
				}
			});
		});
	});
}
