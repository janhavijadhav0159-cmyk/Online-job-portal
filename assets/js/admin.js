/* =====================================================
   ONLINE JOB PORTAL - ADMIN JAVASCRIPT
===================================================== */


/* =====================================================
   ADMIN LOGIN
===================================================== */

function adminLogin() {

    const form =
        document.getElementById("adminLoginForm");

    if (!form) {
        return;
    }


    form.addEventListener("submit", function(event) {

        event.preventDefault();


        const username =
            document.getElementById("adminUsername").value.trim();

        const password =
            document.getElementById("adminPassword").value;


        if (
            username === "admin" &&
            password === "admin123"
        ) {

            localStorage.setItem(
                "adminLoggedIn",
                "true"
            );

            alert("Admin login successful!");

            window.location.href =
                "dashboard.html";

        } else {

            alert(
                "Invalid username or password."
            );

        }

    });

}


/* =====================================================
   ADMIN LOGOUT
===================================================== */

function adminLogout() {

    localStorage.removeItem(
        "adminLoggedIn"
    );

    window.location.href =
        "login.html";

}


/* =====================================================
   LOGIN CHECK
===================================================== */

function checkAdminLogin() {

    const currentPage =
        window.location.pathname
        .split("/")
        .pop();


    const publicPage =
        currentPage === "login.html";


    if (
        !publicPage &&
        localStorage.getItem("adminLoggedIn") !== "true"
    ) {

        window.location.href =
            "login.html";

    }

}


/* =====================================================
   GET DATA
===================================================== */

function getUserData() {

    const data =
        localStorage.getItem(
            "jobPortalUser"
        );

    if (!data) {
        return [];
    }

    return [JSON.parse(data)];

}


function getEmployerData() {

    const data =
        localStorage.getItem(
            "jobPortalEmployer"
        );

    if (!data) {
        return [];
    }

    return [JSON.parse(data)];

}


function getJobsData() {

    const data =
        localStorage.getItem(
            "jobPortalEmployerJobs"
        );

    if (!data) {
        return [];
    }

    return JSON.parse(data);

}


function getApplicationsData() {

    const data =
        localStorage.getItem(
            "jobPortalApplications"
        );

    if (!data) {
        return [];
    }

    return JSON.parse(data);

}


/* =====================================================
   DASHBOARD
===================================================== */

function loadAdminDashboard() {

    const users =
        getUserData();

    const employers =
        getEmployerData();

    const jobs =
        getJobsData();

    const applications =
        getApplicationsData();


    const usersElement =
        document.getElementById(
            "dashboardUsers"
        );

    const employersElement =
        document.getElementById(
            "dashboardEmployers"
        );

    const jobsElement =
        document.getElementById(
            "dashboardJobs"
        );

    const applicationsElement =
        document.getElementById(
            "dashboardApplications"
        );


    if (usersElement) {
        usersElement.textContent =
            users.length;
    }


    if (employersElement) {
        employersElement.textContent =
            employers.length;
    }


    if (jobsElement) {
        jobsElement.textContent =
            jobs.length;
    }


    if (applicationsElement) {
        applicationsElement.textContent =
            applications.length;
    }


    loadDashboardRecentJobs();

}


/* =====================================================
   RECENT JOBS
===================================================== */

function loadDashboardRecentJobs() {

    const container =
        document.getElementById(
            "dashboardRecentJobs"
        );


    if (!container) {
        return;
    }


    const jobs =
        getJobsData();


    if (jobs.length === 0) {

        container.innerHTML = `

            <div class="admin-job-card">

                <p>
                    No jobs have been posted yet.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    jobs.slice(-5).reverse().forEach(
        function(job) {

            container.innerHTML += `

                <div class="admin-job-card">

                    <h3>
                        ${job.title}
                    </h3>

                    <p>
                        <strong>
                            ${job.company}
                        </strong>
                    </p>

                    <div class="job-meta">

                        <span>
                            📍 ${job.location}
                        </span>

                        <span>
                            💼 ${job.type}
                        </span>

                        <span>
                            💰 ${job.salary}
                        </span>

                    </div>

                    <a
                        href="job-details.html?id=${job.id}"
                        class="view-btn"
                    >
                        View Details
                    </a>

                </div>

            `;

        }
    );

}


/* =====================================================
   USERS
===================================================== */

function displayUsers(searchText = "") {

    const table =
        document.getElementById(
            "usersTable"
        );


    if (!table) {
        return;
    }


    const users =
        getUserData();


    const filteredUsers =
        users.filter(
            function(user) {

                const text =
                    (
                        user.name +
                        " " +
                        user.email
                    ).toLowerCase();

                return text.includes(
                    searchText.toLowerCase()
                );

            }
        );


    if (filteredUsers.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    style="text-align:center;"
                >
                    No users found.
                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML = "";


    filteredUsers.forEach(
        function(user, index) {

            table.innerHTML += `

                <tr>

                    <td>
                        ${user.name || "User"}
                    </td>

                    <td>
                        ${user.email || "-"}
                    </td>

                    <td>
                        ${user.phone || "-"}
                    </td>

                    <td>

                        <a
                            href="user-details.html?id=${index}"
                            class="view-btn"
                        >
                            View
                        </a>

                    </td>

                </tr>

            `;

        }
    );

}


/* =====================================================
   USER SEARCH
===================================================== */

function userSearch() {

    const input =
        document.getElementById(
            "userSearch"
        );


    if (!input) {
        return;
    }


    input.addEventListener(
        "input",
        function() {

            displayUsers(
                input.value
            );

        }
    );

}


/* =====================================================
   USER DETAILS
===================================================== */

function displayUserDetails() {

    const container =
        document.getElementById(
            "userDetails"
        );


    if (!container) {
        return;
    }


    const users =
        getUserData();


    const params =
        new URLSearchParams(
            window.location.search
        );


    const index =
        Number(
            params.get("id")
        );


    const user =
        users[index];


    if (!user) {

        container.innerHTML = `

            <div class="admin-details-card">

                <h1>User Not Found</h1>

                <p>
                    User information is not available.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML = `

        <div class="admin-details-card">

            <h1>User Details</h1>

            <div class="details-grid">

                <div class="detail-box">

                    <strong>Name</strong>

                    ${user.name || "-"}

                </div>


                <div class="detail-box">

                    <strong>Email</strong>

                    ${user.email || "-"}

                </div>


                <div class="detail-box">

                    <strong>Phone</strong>

                    ${user.phone || "-"}

                </div>


                <div class="detail-box">

                    <strong>Location</strong>

                    ${user.location || "Not provided"}

                </div>

            </div>


            <a
                href="users.html"
                class="view-btn"
            >
                ← Back to Users
            </a>

        </div>

    `;

}


/* =====================================================
   EMPLOYERS
===================================================== */

function displayEmployers(searchText = "") {

    const table =
        document.getElementById(
            "employersTable"
        );


    if (!table) {
        return;
    }


    const employers =
        getEmployerData();


    const filteredEmployers =
        employers.filter(
            function(employer) {

                const text =
                    (
                        employer.companyName +
                        " " +
                        employer.employerName +
                        " " +
                        employer.email
                    ).toLowerCase();

                return text.includes(
                    searchText.toLowerCase()
                );

            }
        );


    if (filteredEmployers.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="text-align:center;"
                >
                    No employers found.
                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML = "";


    filteredEmployers.forEach(
        function(employer, index) {

            table.innerHTML += `

                <tr>

                    <td>
                        ${employer.companyName || "-"}
                    </td>

                    <td>
                        ${employer.employerName || "-"}
                    </td>

                    <td>
                        ${employer.email || "-"}
                    </td>

                    <td>
                        ${employer.phone || "-"}
                    </td>

                    <td>

                        <a
                            href="employer-details.html?id=${index}"
                            class="view-btn"
                        >
                            View
                        </a>

                    </td>

                </tr>

            `;

        }
    );

}


/* =====================================================
   EMPLOYER SEARCH
===================================================== */

function employerSearch() {

    const input =
        document.getElementById(
            "employerSearch"
        );


    if (!input) {
        return;
    }


    input.addEventListener(
        "input",
        function() {

            displayEmployers(
                input.value
            );

        }
    );

}


/* =====================================================
   EMPLOYER DETAILS
===================================================== */

function displayEmployerDetails() {

    const container =
        document.getElementById(
            "employerDetails"
        );


    if (!container) {
        return;
    }


    const employers =
        getEmployerData();


    const params =
        new URLSearchParams(
            window.location.search
        );


    const index =
        Number(
            params.get("id")
        );


    const employer =
        employers[index];


    if (!employer) {

        container.innerHTML = `

            <div class="admin-details-card">

                <h1>Employer Not Found</h1>

                <p>
                    Employer information is not available.
                </p>

            </div>

        `;

        return;

    }


    const jobs =
        getJobsData().filter(
            function(job) {

                return job.employerEmail ===
                    employer.email;

            }
        );


    container.innerHTML = `

        <div class="admin-details-card">

            <h1>
                ${employer.companyName || "Company"}
            </h1>


            <div class="details-grid">

                <div class="detail-box">

                    <strong>Employer Name</strong>

                    ${employer.employerName || "-"}

                </div>


                <div class="detail-box">

                    <strong>Email</strong>

                    ${employer.email || "-"}

                </div>


                <div class="detail-box">

                    <strong>Phone</strong>

                    ${employer.phone || "-"}

                </div>


                <div class="detail-box">

                    <strong>Location</strong>

                    ${employer.location || "-"}

                </div>


                <div class="detail-box">

                    <strong>Website</strong>

                    ${employer.website || "-"}

                </div>


                <div class="detail-box">

                    <strong>Total Jobs</strong>

                    ${jobs.length}

                </div>

            </div>


            <h2>Company Description</h2>

            <p>
                ${employer.description || "No description available."}
            </p>


            <br>


            <a
                href="employers.html"
                class="view-btn"
            >
                ← Back to Employers
            </a>

        </div>

    `;

}


/* =====================================================
   JOBS
===================================================== */

function displayJobs(searchText = "") {

    const table =
        document.getElementById(
            "jobsTable"
        );


    if (!table) {
        return;
    }


    const jobs =
        getJobsData();


    const filteredJobs =
        jobs.filter(
            function(job) {

                const text =
                    (
                        job.title +
                        " " +
                        job.company +
                        " " +
                        job.location
                    ).toLowerCase();

                return text.includes(
                    searchText.toLowerCase()
                );

            }
        );


    if (filteredJobs.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    style="text-align:center;"
                >
                    No jobs found.
                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML = "";


    filteredJobs.forEach(
        function(job) {

            table.innerHTML += `

                <tr>

                    <td>
                        ${job.title}
                    </td>

                    <td>
                        ${job.company}
                    </td>

                    <td>
                        ${job.location}
                    </td>

                    <td>
                        ${job.type}
                    </td>

                    <td>

                        <span class="status status-active">
                            ${job.status || "Active"}
                        </span>

                    </td>

                    <td>

                        <a
                            href="job-details.html?id=${job.id}"
                            class="view-btn"
                        >
                            View
                        </a>

                    </td>

                </tr>

            `;

        }
    );

}


/* =====================================================
   JOB SEARCH
===================================================== */

function jobSearch() {

    const input =
        document.getElementById(
            "jobSearch"
        );


    if (!input) {
        return;
    }


    input.addEventListener(
        "input",
        function() {

            displayJobs(
                input.value
            );

        }
    );

}


/* =====================================================
   JOB DETAILS
===================================================== */

function displayJobDetails() {

    const container =
        document.getElementById(
            "jobDetails"
        );


    if (!container) {
        return;
    }


    const params =
        new URLSearchParams(
            window.location.search
        );


    const id =
        Number(
            params.get("id")
        );


    const jobs =
        getJobsData();


    const job =
        jobs.find(
            function(item) {

                return item.id === id;

            }
        );


    if (!job) {

        container.innerHTML = `

            <div class="admin-details-card">

                <h1>Job Not Found</h1>

                <p>
                    Job information is not available.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML = `

        <div class="admin-details-card">

            <h1>
                ${job.title}
            </h1>

            <p>
                <strong>
                    ${job.company}
                </strong>
            </p>


            <div class="details-grid">

                <div class="detail-box">

                    <strong>Category</strong>

                    ${job.category}

                </div>


                <div class="detail-box">

                    <strong>Location</strong>

                    ${job.location}

                </div>


                <div class="detail-box">

                    <strong>Job Type</strong>

                    ${job.type}

                </div>


                <div class="detail-box">

                    <strong>Salary</strong>

                    ${job.salary}

                </div>


                <div class="detail-box">

                    <strong>Experience</strong>

                    ${job.experience}

                </div>


                <div class="detail-box">

                    <strong>Deadline</strong>

                    ${job.deadline}

                </div>


                <div class="detail-box">

                    <strong>Posted Date</strong>

                    ${job.postedDate}

                </div>


                <div class="detail-box">

                    <strong>Status</strong>

                    ${job.status || "Active"}

                </div>

            </div>


            <h2>Description</h2>

            <p>
                ${job.description}
            </p>


            <h2>Required Skills</h2>

            <p>
                ${job.skills}
            </p>


            <br>


            <a
                href="jobs.html"
                class="view-btn"
            >
                ← Back to Jobs
            </a>

        </div>

    `;

}


/* =====================================================
   APPLICATIONS
===================================================== */

function displayApplications() {

    const table =
        document.getElementById(
            "applicationsTable"
        );


    if (!table) {
        return;
    }


    const applications =
        getApplicationsData();


    const jobs =
        getJobsData();


    if (applications.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="text-align:center;"
                >
                    No applications available.
                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML = "";


    applications.forEach(
        function(application) {

            const job =
                jobs.find(
                    function(item) {

                        return item.id ===
                            application.jobId;

                    }
                );


            table.innerHTML += `

                <tr>

                    <td>
                        ${application.name || "-"}
                    </td>

                    <td>
                        ${application.email || "-"}
                    </td>

                    <td>
                        ${job ? job.title : "Job"}
                    </td>

                    <td>
                        ${application.date || "-"}
                    </td>

                    <td>

                        <span class="status status-${String(
                            application.status || "Pending"
                        ).toLowerCase()}">

                            ${application.status || "Pending"}

                        </span>

                    </td>

                </tr>

            `;

        }
    );

}


/* =====================================================
   CATEGORIES
===================================================== */

function getCategories() {

    const data =
        localStorage.getItem(
            "jobPortalCategories"
        );


    if (!data) {

        const defaultCategories = [

            "IT & Software",

            "Web Development",

            "Data Science",

            "Marketing",

            "Finance",

            "Human Resources"

        ];


        localStorage.setItem(

            "jobPortalCategories",

            JSON.stringify(
                defaultCategories
            )

        );


        return defaultCategories;

    }


    return JSON.parse(data);

}


function saveCategories(categories) {

    localStorage.setItem(

        "jobPortalCategories",

        JSON.stringify(categories)

    );

}


function displayCategories() {

    const container =
        document.getElementById(
            "categoryList"
        );


    if (!container) {
        return;
    }


    const categories =
        getCategories();


    container.innerHTML = "";


    categories.forEach(
        function(category, index) {

            const card =
                document.createElement("div");


            card.className =
                "category-card";


            card.innerHTML = `

                <strong>
                    ${category}
                </strong>

                <button
                    class="delete-btn category-delete"
                    data-index="${index}"
                >
                    Delete
                </button>

            `;


            container.appendChild(card);

        }
    );

}


/* =====================================================
   CATEGORY FORM
===================================================== */

function categoryForm() {

    const form =
        document.getElementById(
            "categoryForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const input =
                document.getElementById(
                    "categoryName"
                );


            const name =
                input.value.trim();


            if (!name) {
                return;
            }


            const categories =
                getCategories();


            if (
                categories
                    .map(
                        function(item) {
                            return item.toLowerCase();
                        }
                    )
                    .includes(name.toLowerCase())
            ) {

                alert(
                    "Category already exists."
                );

                return;

            }


            categories.push(name);


            saveCategories(categories);


            input.value = "";


            displayCategories();


            alert(
                "Category added successfully."
            );

        }
    );

}


/* =====================================================
   CATEGORY DELETE
===================================================== */

function categoryDelete() {

    const container =
        document.getElementById(
            "categoryList"
        );


    if (!container) {
        return;
    }


    container.addEventListener(
        "click",
        function(event) {

            if (
                !event.target.classList
                    .contains("category-delete")
            ) {
                return;
            }


            const index =
                Number(
                    event.target.dataset.index
                );


            const categories =
                getCategories();


            categories.splice(
                index,
                1
            );


            saveCategories(categories);


            displayCategories();

        }
    );

}


/* =====================================================
   REPORTS
===================================================== */

function displayReports() {

    const users =
        getUserData();

    const employers =
        getEmployerData();

    const jobs =
        getJobsData();

    const applications =
        getApplicationsData();


    const reportUsers =
        document.getElementById(
            "reportUsers"
        );

    const reportEmployers =
        document.getElementById(
            "reportEmployers"
        );

    const reportJobs =
        document.getElementById(
            "reportJobs"
        );

    const reportApplications =
        document.getElementById(
            "reportApplications"
        );


    if (reportUsers) {
        reportUsers.textContent =
            users.length;
    }


    if (reportEmployers) {
        reportEmployers.textContent =
            employers.length;
    }


    if (reportJobs) {
        reportJobs.textContent =
            jobs.length;
    }


    if (reportApplications) {
        reportApplications.textContent =
            applications.length;
    }


    const reportText =
        document.getElementById(
            "jobReportText"
        );


    if (reportText) {

        const activeJobs =
            jobs.filter(
                function(job) {

                    return (
                        job.status === "Active" ||
                        !job.status
                    );

                }
            ).length;


        reportText.innerHTML = `

            <p>
                Total posted jobs:
                <strong>${jobs.length}</strong>
            </p>

            <p>
                Active jobs:
                <strong>${activeJobs}</strong>
            </p>

            <p>
                Total applications:
                <strong>${applications.length}</strong>
            </p>

        `;

    }

}


/* =====================================================
   MESSAGES
===================================================== */

function displayMessages() {

    const container =
        document.getElementById(
            "messagesList"
        );


    if (!container) {
        return;
    }


    const messages =
        JSON.parse(
            localStorage.getItem(
                "jobPortalMessages"
            ) || "[]"
        );


    if (messages.length === 0) {

        container.innerHTML = `

            <div class="message-card">

                <h3>
                    No Messages
                </h3>

                <p>
                    No messages have been received yet.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    messages.forEach(
        function(message) {

            container.innerHTML += `

                <div class="message-card">

                    <h3>
                        ${message.name || "Visitor"}
                    </h3>

                    <div class="message-email">
                        ${message.email || ""}
                    </div>

                    <p>
                        ${message.message || ""}
                    </p>

                </div>

            `;

        }
    );

}


/* =====================================================
   ADMIN PROFILE
===================================================== */

function adminProfile() {

    const form =
        document.getElementById(
            "adminProfileForm"
        );


    if (!form) {
        return;
    }


    const saved =
        JSON.parse(
            localStorage.getItem(
                "jobPortalAdminProfile"
            ) || "{}"
        );


    if (saved.name) {

        document.getElementById(
            "adminName"
        ).value =
            saved.name;

    }


    if (saved.email) {

        document.getElementById(
            "adminEmail"
        ).value =
            saved.email;

    }


    if (saved.phone) {

        document.getElementById(
            "adminPhone"
        ).value =
            saved.phone;

    }


    form.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const profile = {

                name:
                    document.getElementById(
                        "adminName"
                    ).value.trim(),

                email:
                    document.getElementById(
                        "adminEmail"
                    ).value.trim(),

                phone:
                    document.getElementById(
                        "adminPhone"
                    ).value.trim()

            };


            localStorage.setItem(

                "jobPortalAdminProfile",

                JSON.stringify(profile)

            );


            alert(
                "Admin profile saved successfully."
            );

        }
    );

}


/* =====================================================
   LOGOUT BUTTON
===================================================== */

function setupLogout() {

    const button =
        document.getElementById(
            "logoutBtn"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        adminLogout
    );

}


/* =====================================================
   INITIALIZATION
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        checkAdminLogin();

        adminLogin();

        setupLogout();

        loadAdminDashboard();

        displayUsers();

        userSearch();

        displayUserDetails();

        displayEmployers();

        employerSearch();

        displayEmployerDetails();

        displayJobs();

        jobSearch();

        displayJobDetails();

        displayApplications();

        displayCategories();

        categoryForm();

        categoryDelete();

        displayReports();

        displayMessages();

        adminProfile();

    }
);