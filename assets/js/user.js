document.addEventListener("DOMContentLoaded", function () {

    /* ================= PASSWORD SHOW/HIDE ================= */

    const passwordButtons =
        document.querySelectorAll(".show-password");

    passwordButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const input =
                document.getElementById(button.dataset.target);

            if (!input) return;

            if (input.type === "password") {

                input.type = "text";
                button.textContent = "Hide";

            } else {

                input.type = "password";
                button.textContent = "Show";

            }

        });

    });


    /* ================= REGISTER ================= */

    const registerForm =
        document.getElementById("registerForm");

    if (registerForm) {

        registerForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const password =
                document.getElementById("password").value;

            const confirmPassword =
                document.getElementById("confirmPassword").value;

            const message =
                document.getElementById("registerMessage");

            if (password !== confirmPassword) {

                message.textContent =
                    "Passwords do not match.";

                message.style.color = "red";

                return;
            }

            localStorage.setItem("jobPortalUserRegistered", "true");

            message.textContent =
                "Registration successful! Redirecting to login...";

            message.style.color = "green";

            setTimeout(function () {
                window.location.href = "login.html";
            }, 1200);

        });

    }


    /* ================= LOGIN ================= */

    const loginForm =
        document.getElementById("loginForm");

    if (loginForm) {

        loginForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const email =
                document.getElementById("email").value.trim();

            const password =
                document.getElementById("password").value.trim();

            const message =
                document.getElementById("loginMessage");

            if (!email || !password) {

                message.textContent =
                    "Please enter email and password.";

                message.style.color = "red";

                return;
            }

            localStorage.setItem("jobPortalLoggedIn", "true");
            localStorage.setItem("jobPortalUserEmail", email);

            message.textContent =
                "Login successful!";

            message.style.color = "green";

            setTimeout(function () {

                window.location.href =
                    "dashboard.html";

            }, 800);

        });

    }


    /* ================= LOGOUT ================= */

    const logoutButtons =
        document.querySelectorAll(".logout-btn");

    logoutButtons.forEach(function (button) {

        button.addEventListener("click", function (event) {

            event.preventDefault();

            localStorage.removeItem("jobPortalLoggedIn");

            window.location.href =
                "login.html";

        });

    });


    /* ================= PROFILE FORM ================= */

    const profileForm =
        document.getElementById("profileForm");

    if (profileForm) {

        profileForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const message =
                document.getElementById("profileMessage");

            if (message) {

                message.textContent =
                    "Profile updated successfully.";

                message.style.color =
                    "green";

            }

        });

    }


    /* ================= RESUME FORM ================= */

    const resumeForm =
        document.getElementById("resumeForm");

    if (resumeForm) {

        resumeForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const message =
                document.getElementById("resumeMessage");

            if (message) {

                message.textContent =
                    "Resume information saved successfully.";

                message.style.color =
                    "green";

            }

        });

    }


    /* ================= SAVE JOB ================= */

    const saveButtons =
        document.querySelectorAll(".save-job");

    saveButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const jobId =
                button.dataset.job;

            let savedJobs =
                JSON.parse(
                    localStorage.getItem("savedJobs") || "[]"
                );

            if (savedJobs.includes(jobId)) {

                savedJobs =
                    savedJobs.filter(function (id) {
                        return id !== jobId;
                    });

                button.classList.remove("saved");
                button.textContent = "♡ Save Job";

            } else {

                savedJobs.push(jobId);

                button.classList.add("saved");
                button.textContent = "♥ Saved";

            }

            localStorage.setItem(
                "savedJobs",
                JSON.stringify(savedJobs)
            );

        });

    });


    /* ================= APPLICATION ================= */

    const applyButtons =
        document.querySelectorAll(".apply-job");

    applyButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const jobId =
                button.dataset.job;

            let applications =
                JSON.parse(
                    localStorage.getItem("applications") || "[]"
                );

            if (!applications.includes(jobId)) {

                applications.push(jobId);

                localStorage.setItem(
                    "applications",
                    JSON.stringify(applications)
                );

                button.textContent =
                    "Applied";

                button.disabled = true;

            } else {

                alert("You have already applied for this job.");

            }

        });

    });

});



/* ================= USER JOB SEARCH ================= */

const userJobSearch =
    document.getElementById("userJobSearch");

if (userJobSearch) {

    userJobSearch.addEventListener("submit", function (event) {

        event.preventDefault();

        const keyword =
            document
                .getElementById("userJobKeyword")
                .value
                .toLowerCase()
                .trim();

        const location =
            document
                .getElementById("userJobLocation")
                .value
                .toLowerCase()
                .trim();

        const type =
            document
                .getElementById("userJobType")
                .value
                .toLowerCase();

        const jobs =
            document.querySelectorAll(".user-job-card");

        jobs.forEach(function (job) {

            const title =
                job.dataset.title.toLowerCase();

            const jobLocation =
                job.dataset.location.toLowerCase();

            const jobType =
                job.dataset.type.toLowerCase();

            const keywordMatch =
                !keyword || title.includes(keyword);

            const locationMatch =
                !location ||
                jobLocation.includes(location);

            const typeMatch =
                !type || jobType === type;

            if (
                keywordMatch &&
                locationMatch &&
                typeMatch
            ) {
                job.style.display = "block";
            } else {
                job.style.display = "none";
            }

        });

    });

}