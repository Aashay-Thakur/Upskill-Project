import { auth } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "firebase/auth";

const registerForm = document.querySelector("#register-form");
const emailInput = registerForm["register-email"];
const passwordInput = registerForm["register-password"];

registerForm.addEventListener("submit", (e) => {
	e.preventDefault();
	let email = emailInput.value;
	let password = passwordInput.value;

	createUserWithEmailAndPassword(auth, email, password)
		.then((cred) => {
			console.log(cred.user);
		})
		.catch((error) => {
			console.error(error);
		});
});

// createUserWithEmailAndPassword(auth, "email", "password");
