import moment from "moment";
import $ from "jquery";
import { db, auth } from "./firebase-config";
import { getDocs, where, query, Timestamp, collection } from "firebase/firestore";
import "../styles/calendar.scss";

var collapsibleElems;
var collapsibleInstances;

var modalElems;
var modalInstances;

document.addEventListener("DOMContentLoaded", function () {
	collapsibleElems = document.querySelectorAll(".collapsible");
	collapsibleInstances = M.Collapsible.init(collapsibleElems, { accordion: false });

	modalElems = document.querySelectorAll(".modal");
	modalInstances = M.Modal.init(modalElems, {});
});

const scheduleList = document.querySelector("#schedule-list");

let currentMoment = moment();
const selectDropDown = document.getElementById("select-month");

let months = {
	0: "January",
	1: "February",
	2: "March",
	3: "April",
	4: "May",
	5: "June",
	6: "July",
	7: "August",
	8: "September",
	9: "October",
	10: "November",
	11: "December",
};

let monthAndYear = document.getElementById("month-year-heading");
renderCalendar(moment().month(), currentMoment.year());

function today() {
	currentMoment = moment();
	renderCalendar(currentMoment.month(), currentMoment.year());
}

async function renderCalendar(renderMonth, renderYear) {
	currentMoment = moment().set({ year: renderYear, month: renderMonth });
	let firstDay = currentMoment.startOf("month").format("d");
	let daysInMonth = currentMoment.daysInMonth();

	let scheduleDays = [];

	// Check if there are any lectures scheduled for the rendered month
	var firstDayQuery = where("date", ">=", Timestamp.fromDate(new Date(currentMoment.format("YYYY-MM-01") + " " + "00:00:00")));
	var lastDayQuery = where("date", "<=", Timestamp.fromDate(new Date(currentMoment.format("YYYY-MM-") + daysInMonth + " " + "23:59:59")));
	await getDocs(query(collection(db, "college/NKT01/schedule"), firstDayQuery, lastDayQuery)).then((docSnapshot) => {
		if (!docSnapshot.empty) {
			docSnapshot.docs.forEach((doc) => {
				let stringDate = moment(doc.data().date.toDate()).format("M-D-YYYY");
				scheduleDays.push(stringDate);
			});
		}
	});

	let table = document.getElementById("calendar-body");
	table.innerHTML = "";

	// TODO Might Make it from static to dynamic drop down
	monthAndYear.innerHTML = months[renderMonth] + " " + renderYear;

	selectDropDown.value = parseInt(renderMonth + 1);

	let date = 1;
	// Row Loop
	for (let i = 0; i < 6; i++) {
		let row = document.createElement("tr");

		// Days in a week Loop
		for (let j = 0; j < 7; j++) {
			if (i === 0 && j < firstDay) {
				let cell = document.createElement("td");
				let cellText = document.createTextNode("");
				cell.appendChild(cellText);
				row.appendChild(cell);
			} else if (date > daysInMonth) {
				break;
			} else {
				let cell = document.createElement("td");
				let cellText = document.createTextNode(date);
				cell.dataset.date = `${renderMonth + 1}-${date}-${renderYear}`;
				if (date === moment().date() && renderYear === moment().year() && renderMonth === moment().month()) {
					cell.classList.add("today", "waves-light");
				}
				cell.classList.add("day", "waves-effect");
				cell.appendChild(cellText);

				if (scheduleDays.includes(cell.dataset.date)) cell.classList.add("scheduled-day");

				row.appendChild(cell);
				date++;
			}
		}
		table.appendChild(row);
	}
	addListeners();
}

$("#next").on("click", function () {
	next();
});
$("#previous").on("click", function () {
	previous();
});
$("#today").on("click", function () {
	today();
	setTimeout(function () {
		$(".today").removeClass("highlight");
		$(".today").addClass("highlight");
	}, 200);
});

$("#select-month").on("change", function () {
	currentMoment = moment().set({ month: $("#select-month").val() - 1, year: currentMoment.year() });
	renderCalendar(currentMoment.month(), currentMoment.year());
});

function next() {
	currentMoment = currentMoment.add(1, "month");
	renderCalendar(currentMoment.month(), currentMoment.year());
}

function previous() {
	currentMoment = currentMoment.subtract(1, "month");
	renderCalendar(currentMoment.month(), currentMoment.year());
}

function addListeners() {
	$(".day").on("click", function () {
		let oldSelectDate;
		if (document.querySelector(".selected")) oldSelectDate = document.querySelector(".selected").dataset.date;
		$(".selected").removeClass("selected waves-light");
		$(this).addClass("selected waves-light");
		if (document.querySelectorAll(".toastBox").length > 5) M.Toast.dismissAll();
		getSchedule(oldSelectDate);
	});
}

$(schedule).on("click", function (e) {
	e.preventDefault();
	let selectedElem = document.querySelector(".selected");
	if (!selectedElem) M.toast({ html: "Please Select a Day First", classes: "toastBox" });
	if (selectedElem) {
		modalInstances[0].open();
	}
});

async function getSchedule(previousSelectedDate) {
	var selectedElem = document.querySelector(".selected");
	if (previousSelectedDate === selectedElem.dataset.date) return;
	let dateQuery;

	if (/\d{1,2}-\d{1,2}-\d{1,2}/.test(selectedElem.dataset.date)) {
		dateQuery = new Date(/^(.*)$/g.exec(selectedElem.dataset.date)[1]);
	} else {
		dateQuery = new Date();
	}

	// Query to get all the schedule for the selected day
	var query1 = where("date", ">=", Timestamp.fromDate(new Date(dateQuery.toLocaleDateString() + " " + "00:00:00")));
	var query2 = where("date", "<=", Timestamp.fromDate(new Date(dateQuery.toLocaleDateString() + " " + "23:59:59")));

	await getDocs(query(collection(db, "college/NKT01/schedule"), query1, query2)).then((docSnapshot) => {
		if (docSnapshot.empty) {
			let string = `No Lectures Scheduled for the ${moment(dateQuery).format("Do MMMM").split(" ").join(" of ")}`;
			M.toast({ html: string, classes: "toastBox" });
			$(".day-schedules").animate({ height: 0 + "px" }, 300);
			$(".schedule-list-item").remove();
			return;
		}
		let docId = docSnapshot.docs[0].id;
		let index = 0;

		getDocs(collection(db, "college/NKT01/schedule/" + docId + "/lecturesScheduled")).then((scheduleSnap) => {
			let templateString = "";
			scheduleSnap.forEach((lecture) => {
				if (lecture.data()) {
					let data = lecture.data();
					let startTime = moment(data.startTime.toDate()).format("LT");

					templateString += `
							<li class="schedule-list-item" style="animation-delay: ${(index * 1000) / 2 + 500}ms; opacity: 0">
								<div class="collapsible-header schedule-item">
									<div><span class="head-subject">${data.subject}</span><span class="head-time right">${startTime}</span></div>
								</div>
								<div class="collapsible-body">
								
								<div class="row">
									<div class="col s6">Start Time: ${moment(data.startTime.toDate()).format("h:mm a")}</div>
									<div class="col s6"><i class="material-icons">access_time</i>End Time: ${moment(data.endTime.toDate()).format("h:mm a")}</div>
								</div>

								<div class="row">
									<div class="col s6">Teacher: ${data.teacher}</div>
								</div>
								</div>
							</li>
						`;
					index++;
				}
			});
			document.querySelector(".placeholder-ul").innerHTML = templateString.replace(/schedule-list-item/g, "");
			let setHeight = getAbsoluteHeight(document.querySelector(".placeholder"));
			console.log(setHeight);
			$(".day-schedules").animate({ height: setHeight }, 300, "swing", function () {
				$(".day-schedules").css("height", "auto");
			});
			scheduleList.innerHTML = templateString;
		});
	});
}

function getAbsoluteHeight(el) {
	// Get the DOM Node if you pass in a string
	el = typeof el === "string" ? document.querySelector(el) : el;

	var styles = window.getComputedStyle(el);
	var margin = parseFloat(styles["marginTop"]) + parseFloat(styles["marginBottom"]);

	return Math.ceil(el.offsetHeight + margin);
}
