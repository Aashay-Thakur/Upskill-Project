import { auth } from "./firebase-config.js";
import { setPersistence, signInWithEmailAndPassword, inMemoryPersistence } from "firebase/auth";
import axios from "axios";

const loginForm = document.getElementById("login-form");
const errorText = document.querySelector(".error-html");

loginForm.addEventListener("submit", (e) => {
	e.preventDefault();

	const emailInput = loginForm["login-email"].value;
	const passwordInput = loginForm["login-password"].value;
	const rememberMe = loginForm["rememberMe"];

	if (rememberMe.checked) {
		setPersistence(auth, inMemoryPersistence).then(() => {
			signInWithEmailAndPassword(auth, emailInput, passwordInput)
				.then((cred) => {
					const user = cred.user;
					console.log(user);
				})
				.catch((error) => {
					console.error(error.code);
					errorText.textContent = error.code == "auth/user-not-found" ? "The Entered Email or Password might be wrong" : "";
					errorText.textContent = error.code == "auth/wrong-password" ? "The Entered Email or Password might be wrong" : "";
				});
		});
	} else {
		signInWithEmailAndPassword(auth, emailInput, passwordInput)
			.then((cred) => {
				const user = cred.user;
				// console.log(user);
			})
			.catch((error) => {
				console.error(error);
				errorText.textContent = error.code === "auth/user-not-found" ? "The Entered Email or Password might be wrong" : "";
				errorText.textContent = error.code == "auth/wrong-password" ? "The Entered Email or Password might be wrong" : "";
			});
	}
});
