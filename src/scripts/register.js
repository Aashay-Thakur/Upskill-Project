import { auth, db, userState } from "./firebase-config.js";
import { createUserWithEmailAndPassword, onAuthStateChanged, updateProfile } from "firebase/auth";
import $ from "jquery";
import axios from "axios";
import { getDocs, query, collection, where, setDoc, doc, getDoc, addDoc } from "firebase/firestore";

document.addEventListener("DOMContentLoaded", () => {
	let passwordCheckHtml = `<ul>
								<li>Password Needs to be more than <b>8 Characters long</b></li>
								<li>It must contain one <b>Uppercase Letter</b></li>
								<li>It must contain one <b>Lowercase Letter</b></li>
								<li>It must contain a <b>Numeric digit</b></li>
								<li>It must contain atleast one <b>Speacial Character</b></li>
							</ul>`;

	const passwordTooltipElem = document.querySelector("#register-password");

	const tooltipInstances = M.Tooltip.init(passwordTooltipElem, {
		html: passwordCheckHtml,
		position: "top",
		margin: 15,
	});
});
const registerForm = document.querySelector("#register-form");

const firstNameInput = registerForm["first-name"];
const lastNameInput = registerForm["last-name"];
const emailInput = registerForm["register-email"];
const passwordInput = registerForm["register-password"];
const phoneInput = registerForm["register-phone"];
const classCodeInput = registerForm["class-code"];

$(passwordInput).on("input", function () {
	var password = $(this).val();
	if (password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/)) {
		$(this).removeClass("invalid");
		$(this).addClass("valid");
	} else {
		$(this).removeClass("valid");
		$(this).addClass("invalid");
	}
});

registerForm.addEventListener("submit", (e) => {
	e.preventDefault();

	// if ($(".invalid").length != 0) return false;

	let userData = {
		firstName: firstNameInput.value,
		lastName: lastNameInput.value,
		email: emailInput.value,
		password: passwordInput.value,
		contact: phoneInput.value,
		classCode: classCodeInput.value,
	};

	isTeacher(userData.classCode)
		.then((res) => {
			if (res.isTeacher) {
				createUser(userData, true);
			} else {
				createUser(userData, false);
			}
		})
		.catch((e) => {
			M.toast({ html: "Invalid Class Code" });
		});
});

async function createUser(userData, isTeacher) {
	let { firstName, lastName, email, password, contact, classCode } = userData;
	if (isTeacher) {
		// Registering a teacher
		await createUserWithEmailAndPassword(auth, email, password).then((cred) => {
			let user = {
				firstName,
				lastName,
				email,
				contact,
				classCode,
				uid: cred.user.uid,
			};
			setDoc(doc(db, "college/NKT01/teachers", user.uid), user);
			updateProfile(cred.user, { displayName: `${firstName} ${lastName}`, phoneNumber: parseInt(contact) });
			axios({
				method: "post",
				url: "/setCustomClaims",
				data: { uid: cred.user.uid, isTeacher: true },
			})
				.then((res) => {
					console.log(res);
				})
				.catch((err) => {
					console.error(err);
				});
		});
	} else if (!isTeacher) {
		// Registering a Student
		await createUserWithEmailAndPassword(auth, email, password).then(async (cred) => {
			let user = {
				firstName,
				lastName,
				email,
				contact,
				classCode,
				uid: cred.user.uid,
			};
			let classDoc = await getDocs(query(collection(db, "college/NKT01/classes"), where("classCode", "==", classCode)));
			let classDocID = classDoc.docs[0].id;
			setDoc(doc(db, `college/NKT01/classes/${classDocID}/students`, user.uid), user);
			updateProfile(cred.user, { displayName: `${firstName} ${lastName}`, phoneNumber: contact });
			axios({
				method: "post",
				url: "/setCustomClaims",
				data: { uid: cred.user.uid, isTeacher: false },
			})
				.then((res) => {
					console.log(res.data);
				})
				.catch((err) => console.error(err));
		});
	}
}

const showPass = document.querySelector(".show-password");
showPass.addEventListener("click", () => {
	if (passwordInput.type === "password") {
		passwordInput.type = "text";
		showPass.innerHTML = "visibility_off";
	} else {
		showPass.innerHTML = "visibility";
		passwordInput.type = "password";
	}
	passwordInput.focus();
});

// return cred.user.getIdToken();
// .then((idToken) => {
// 	axios({
// 		method: "POST",
// 		url: "/setCustomClaims",
// 		data: {
// 			idToken: idToken,
// 		},
// 	}).then((res) => {
// 		console.log(res);
// 	});
// })

async function isTeacher(code) {
	try {
		let res = await axios.post("/checkCode", { code });
		return { isTeacher: res.data.isTeacher };
	} catch (e) {
		return e;
	}
}
