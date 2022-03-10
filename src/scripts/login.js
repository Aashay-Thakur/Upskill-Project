import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword, setPersistence, inMemoryPersistence } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js";

const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", function (event) {
	event.preventDefault();

	const errorText = document.querySelector(".error");
	errorText.textContent = "";

	const email = loginForm["email"].value;
	const password = loginForm["password"].value;
	const rememberMe = loginForm["remember-me-check"];

	if (rememberMe.checked) {
		setPersistence(auth, inMemoryPersistence).then(() => {
			signInWithEmailAndPassword(auth, email, password)
				.then((cred) => {
					const user = cred.user;
					console.log(user);
				})
				.catch((error) => {
					errorText.textContent = error.code === "auth/user-not-found" ? "The Entered Email or Password might be wrong" : "";
				});
		});
	} else {
		signInWithEmailAndPassword(auth, email, password)
			.then((cred) => {
				const user = cred.user;
				console.log(user);
			})
			.catch((error) => {
				errorText.textContent = error.code === "auth/user-not-found" ? "The Entered Email or Password might be wrong" : "";
			});
	}
});
