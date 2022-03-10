## E-LEARNING MANAGEMENT PROJECT

---

**FINAL YEAR PROJECT**

This project is a simple platform for teachers and students to manage most of the tedious work invloving Learning Online.
Since lockdown worldwide, the shift from physical attendance to virtual has been a bit hard for teachers and students.

So I decided to make it my goal to make an application that does most of the work and make it easier for everyone, and at the same time also get my Project
completed.
This project is done by a student, mostly alone, so its no way even near perfect, but I am doing my best.

---

### **BACK END**

Simple Express App, Simple Routing, nothing fancy, just simple stuff.

---

### **DATABASE**

I 💖 [Firebase](https://firebase.google.com).
It is amazing, and however much I say is not enough.
Firestore has great structuring, and I thought I would go with a noSQL DB, because managing all those schemas is a pain tbh.

[Firebase Docs](https://firebase.google.com/docs)

---

### **AUTHENTICATION**

This one is a bit tricky.
For the most part I have used Firebase's Authentication, which is simple enough to use, even has an option different Authentication providers, like google.
The tricky part for me was to differentiate between admin, teachers and students.
At the time of writing this, I haven't covered that part yet, but I am planning to make use of Cloud Functions to add custom tokens for each user.

---

### **NOTICE FORMATING**

#### **Markdown**

Decided to go with a markdown interpreter to make formating the document easier. Heres the GitRepo for the interpreter [Marked](https://github.com/markedjs/marked)

#### **DOMPurify**

Another great tool is the [DOMPurify](https://github.com/cure53/DOMPurify).

**_Highly Recommended_**

Sanitizes the content to protect from XSS attacks.

---

#### _SERVICES_

1. Notes
2. Scheduling
3. Attendance
4. Meeting Managing\*
5. Documents Upload\*\*

\*Might look into the teams API for added functionality to the project. Too bad Google Meet doesn't provide one. I want some way of automatically
marking attendance depending on a set amount of time a student has spent in a lecture, instead of just doing it on a click event.

\*\*Not Sure of this one yet, I think Google has Storage that will help with this.

---

#### **What's Working Now**

-   Login
-   Making Schedule
-   Viewing Schedule
-   Can create Notes, but can't publish yet.

---

**TODO**

-   [ ] Adding User Details on First Login
-   [x] Let Teachers make Notes
    -   [ ] Should be able to broadcast
    -   [ ] All Students should be able to view them and get notified
-   [ ] Let Students view these notes (And comment on them? maybe.)
-   [ ] Desing Layout and well, everything. Work that CSS magic.
        (Don't even know where to begin, I love CSS but I am not creative enought to come up with design ideas)
