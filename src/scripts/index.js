function renderSchedules(data) {
	const mainContainer = document.querySelector(".schedule-container");

	scheduleHTML = `
        <div class="schedule-item">
            <div class="subject">${data.subject}</div>
            <div class="teacher">${data.teacher}</div>
            <div class="start-time">${data.startTime.toDate()}</div>
            <div class="end-time">${data.endTime.toDate()}</div>
            <a class="join-button" href="${data.joinLink}" target="_blank">JOIN</a=>
        </div><p/>
    `;

	mainContainer.innerHTML += scheduleHTML;
}
