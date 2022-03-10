import moment from "moment";
import $ from "jquery";

// let currentMonth = moment().month();
// let currentYear = moment().year();

let currentMoment = moment();
const selectDropDown = document.getElementById("select-month");

document.addEventListener("DOMContentLoaded", function () {
	var elems = document.querySelectorAll("select");
	var instances = M.FormSelect.init(elems, {});
	console.log(instances[0]);
});

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
	// currentYear = moment().year();
	// currentMonth = moment().month();
	currentMoment = moment();
	renderCalendar(currentMoment.month(), currentMoment.year());
}

function renderCalendar(renderMonth, renderYear) {
	currentMoment = moment().set({ year: renderYear, month: renderMonth });
	let firstDay = currentMoment.startOf("month").format("d");
	let daysInMonth = currentMoment.daysInMonth();

	let table = document.getElementById("calendar-body");
	table.innerHTML = "";

	// TODO Might Make it from static to dynamic drop down
	monthAndYear.innerHTML = months[renderMonth] + " " + renderYear;

	selectDropDown.value = parseInt(renderMonth + 1);

	let date = 1;
	// Vertical Loop to create rows
	for (let i = 0; i < 6; i++) {
		let row = document.createElement("tr");

		// Horizontal loop to create the cells (Week days)
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
				if (date === moment().date() && renderYear === moment().year() && renderMonth === moment().month()) {
					cell.classList.add("day", "today", "waves-light");
				}
				cell.classList.add("day", "waves-effect");
				cell.appendChild(cellText);
				row.appendChild(cell);
				date++;
			}
		}
		table.appendChild(row);
	}
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
