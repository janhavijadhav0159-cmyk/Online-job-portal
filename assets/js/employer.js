/* =====================================================
   ONLINE JOB PORTAL - EMPLOYER JAVASCRIPT
===================================================== */


/* =====================================================
   STORAGE HELPERS
===================================================== */

function getEmployer() {

    const employer = localStorage.getItem("jobPortalEmployer");

    if (!employer) {
        return null;
    }

    return JSON.parse(employer);
}


function saveEmployer(employer) {

    localStorage.setItem(
        "jobPortalEmployer",
        JSON.stringify(employer)
    );
}


function isEmployerLoggedIn() {

    return localStorage.getItem("employerLoggedIn") === "true";
}


/* =====================================================
   LOGOUT
===================================================== */

function employerLogout() {

    localStorage.removeItem("employerLoggedIn");

    window.location.href = "login.html";
}


/* =====================================================
   AUTH CHECK
===================================================== */

function checkEmployerLogin() {

    const page = window.location.pathname;

    const protectedPages = [
        "dashboard.html",
        "profile.html",
        "post-job.html",
        "jobs.html",
        "job-details.html",
        "applications.html",
        "applicant-details.html"
    ];

    const currentPage = page.split("/").pop();

    if (
        protectedPages.includes(currentPage) &&
        !isEmployerLoggedIn()
    ) {

        window.location.href = "login.html";

    }

}


/* =====================================================
   REGISTER
===================================================== */

function employerRegister() {

    const form = document.getElementById(
        "employerRegisterForm"
    );

    if (!form) {
        return;
    }


    form.addEventListener("submit", function(event) {

        event.preventDefault();


        const companyName =
            document.getElementById("companyName").value.trim();

        const employerName =
            document.getElementById("employerName").value.trim();

        const email =
            document.getElementById("employerEmail").value.trim();

        const phone =
            document.getElementById("employerPhone").value.trim();

        const password =
            document.getElementById("employerPassword").value;

        const confirmPassword =
            document.getElementById(
                "confirmEmployerPassword"
            ).value;


        if (password !== confirmPassword) {

            alert("Password and Confirm Password do not match.");

            return;
        }


        const employer = {

            companyName: companyName,

            employerName: employerName,

            email: email,

            phone: phone,

            password: password,

            website: "",

            location: "",

            description: ""

        };


        saveEmployer(employer);


        alert(
            "Registration successful! Please login."
        );


        window.location.href = "login.html";

    });

}


/* =====================================================
   LOGIN
===================================================== */

function employerLogin() {

    const form = document.getElementById(
        "employerLoginForm"
    );

    if (!form) {
        return;
    }


    form.addEventListener("submit", function(event) {

        event.preventDefault();


        const email =
            document.getElementById(
                "loginEmployerEmail"
            ).value.trim();

        const password =
            document.getElementById(
                "loginEmployerPassword"
            ).value;


        const employer = getEmployer();


        if (!employer) {

            alert(
                "Account not found. Please register first."
            );

            return;
        }


        if (
            email === employer.email &&
            password === employer.password
        ) {

            localStorage.setItem(
                "employerLoggedIn",
                "true"
            );


            alert("Login successful!");


            window.location.href =
                "dashboard.html";

        } else {

            alert(
                "Invalid email or password."
            );

        }

    });

}


/* =====================================================
   DISPLAY EMPLOYER NAME
===================================================== */

function displayEmployerName() {

    const employer = getEmployer();

    if (!employer) {
        return;
    }


    const nameElements = [

        "dashboardEmployerName",

        "profileEmployerName",

        "postJobEmployerName",

        "jobsEmployerName",

        "jobDetailsEmployerName",

        "applicationsEmployerName",

        "applicantEmployerName"

    ];


    nameElements.forEach(function(id) {

        const element =
            document.getElementById(id);

        if (element) {

            element.textContent =
                employer.employerName;

        }

    });

}


/* =====================================================
   PROFILE
===================================================== */

function loadEmployerProfile() {

    const form = document.getElementById(
        "employerProfileForm"
    );

    if (!form) {
        return;
    }


    const employer = getEmployer();

    if (!employer) {
        return;
    }


    document.getElementById(
        "profileCompanyName"
    ).value =
        employer.companyName || "";


    document.getElementById(
        "profileName"
    ).value =
        employer.employerName || "";


    document.getElementById(
        "profileEmail"
    ).value =
        employer.email || "";


    document.getElementById(
        "profilePhone"
    ).value =
        employer.phone || "";


    document.getElementById(
        "profileWebsite"
    ).value =
        employer.website || "";


    document.getElementById(
        "profileLocation"
    ).value =
        employer.location || "";


    document.getElementById(
        "profileDescription"
    ).value =
        employer.description || "";


    form.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            employer.companyName =
                document.getElementById(
                    "profileCompanyName"
                ).value.trim();


            employer.employerName =
                document.getElementById(
                    "profileName"
                ).value.trim();


            employer.email =
                document.getElementById(
                    "profileEmail"
                ).value.trim();


            employer.phone =
                document.getElementById(
                    "profilePhone"
                ).value.trim();


            employer.website =
                document.getElementById(
                    "profileWebsite"
                ).value.trim();


            employer.location =
                document.getElementById(
                    "profileLocation"
                ).value.trim();


            employer.description =
                document.getElementById(
                    "profileDescription"
                ).value.trim();


            saveEmployer(employer);


            alert(
                "Company profile updated successfully."
            );


            displayEmployerName();

        }
    );

}


/* =====================================================
   JOB STORAGE
===================================================== */

function getJobs() {

    const jobs =
        localStorage.getItem(
            "jobPortalEmployerJobs"
        );


    if (!jobs) {

        return [];

    }


    return JSON.parse(jobs);

}


function saveJobs(jobs) {

    localStorage.setItem(

        "jobPortalEmployerJobs",

        JSON.stringify(jobs)

    );

}


/* =====================================================
   POST JOB
===================================================== */

function postJob() {

    const form =
        document.getElementById(
            "postJobForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const employer =
                getEmployer();


            if (!employer) {

                alert(
                    "Please login first."
                );

                return;

            }


            const jobs =
                getJobs();


            const newJob = {

                id: Date.now(),

                title:
                    document.getElementById(
                        "jobTitle"
                    ).value.trim(),

                category:
                    document.getElementById(
                        "jobCategory"
                    ).value,

                location:
                    document.getElementById(
                        "jobLocation"
                    ).value.trim(),

                type:
                    document.getElementById(
                        "jobType"
                    ).value,

                salary:
                    document.getElementById(
                        "jobSalary"
                    ).value.trim(),

                experience:
                    document.getElementById(
                        "jobExperience"
                    ).value.trim(),

                description:
                    document.getElementById(
                        "jobDescription"
                    ).value.trim(),

                skills:
                    document.getElementById(
                        "jobSkills"
                    ).value.trim(),

                deadline:
                    document.getElementById(
                        "jobDeadline"
                    ).value,

                company:
                    employer.companyName,

                employerEmail:
                    employer.email,

                postedDate:
                    new Date().toLocaleDateString(),

                status:
                    "Active"

            };


            jobs.push(newJob);


            saveJobs(jobs);


            alert(
                "Job posted successfully!"
            );


            form.reset();


            window.location.href =
                "jobs.html";

        }
    );

}


/* =====================================================
   DISPLAY JOBS
===================================================== */

function displayEmployerJobs() {

    const container =
        document.getElementById(
            "employerJobs"
        );


    if (!container) {
        return;
    }


    const jobs =
        getJobs();


    if (jobs.length === 0) {

        container.innerHTML = `

            <div class="job-card">

                <h3>No Jobs Posted Yet</h3>

                <p>
                    Start by posting your first job.
                </p>

                <br>

                <a
                    href="post-job.html"
                    class="primary-btn"
                >
                    Post Job
                </a>

            </div>

        `;

        return;
    }


    container.innerHTML = "";


    jobs.forEach(function(job) {

        const card =
            document.createElement("div");


        card.className =
            "job-card";


        card.innerHTML = `

            <h3>${job.title}</h3>

            <div class="job-company">
                ${job.company}
            </div>

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

                <span>
                    ⭐ ${job.experience}
                </span>

            </div>

            <p>
                ${job.description.substring(0, 180)}
                ${job.description.length > 180 ? "..." : ""}
            </p>

            <div class="job-card-actions">

                <a
                    href="job-details.html?id=${job.id}"
                    class="primary-btn"
                >
                    View Details
                </a>

                <button
                    class="secondary-btn delete-btn"
                    onclick="deleteJob(${job.id})"
                >
                    Delete
                </button>

            </div>

        `;


        container.appendChild(card);

    });

}


/* =====================================================
   DELETE JOB
===================================================== */

function deleteJob(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this job?"
        );


    if (!confirmDelete) {
        return;
    }


    let jobs =
        getJobs();


    jobs =
        jobs.filter(
            function(job) {

                return job.id !== id;

            }
        );


    saveJobs(jobs);


    alert("Job deleted successfully.");


    displayEmployerJobs();

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
        getJobs();


    const job =
        jobs.find(
            function(item) {

                return item.id === id;

            }
        );


    if (!job) {

        container.innerHTML = `

            <div class="details-card">

                <h1>Job Not Found</h1>

                <p>
                    The requested job does not exist.
                </p>

                <br>

                <a
                    href="jobs.html"
                    class="primary-btn"
                >
                    Back to Jobs
                </a>

            </div>

        `;

        return;
    }


    container.innerHTML = `

        <div class="details-card">

            <h1>${job.title}</h1>

            <p class="job-company">
                ${job.company}
            </p>


            <div class="details-info">

                <div class="info-box">

                    <strong>Location</strong>

                    ${job.location}

                </div>


                <div class="info-box">

                    <strong>Job Type</strong>

                    ${job.type}

                </div>


                <div class="info-box">

                    <strong>Salary</strong>

                    ${job.salary}

                </div>


                <div class="info-box">

                    <strong>Experience</strong>

                    ${job.experience}

                </div>


                <div class="info-box">

                    <strong>Category</strong>

                    ${job.category}

                </div>


                <div class="info-box">

                    <strong>Deadline</strong>

                    ${job.deadline}

                </div>

            </div>


            <h2>Job Description</h2>

            <p>
                ${job.description}
            </p>


            <h2>Required Skills</h2>

            <p>
                ${job.skills}
            </p>


            <h2>Posted Date</h2>

            <p>
                ${job.postedDate}
            </p>


            <br>


            <a
                href="jobs.html"
                class="primary-btn"
            >
                Back to Jobs
            </a>

        </div>

    `;

}


/* =====================================================
   APPLICATION STORAGE
===================================================== */

function getApplications() {

    const applications =
        localStorage.getItem(
            "jobPortalApplications"
        );


    if (!applications) {

        return [];

    }


    return JSON.parse(applications);

}


/* =====================================================
   DISPLAY APPLICATIONS
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
        getApplications();


    const jobs =
        getJobs();


    if (applications.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    style="text-align:center;"
                >
                    No applications received yet.
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


            if (!job) {
                return;
            }


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${application.name}
                </td>

                <td>
                    ${job.title}
                </td>

                <td>
                    ${application.email}
                </td>

                <td>
                    ${application.date}
                </td>

                <td>

                    <span class="status status-${application.status.toLowerCase()}">

                        ${application.status}

                    </span>

                </td>

                <td>

                    <a
                        href="applicant-details.html?id=${application.id}"
                        class="view-btn"
                    >
                        View
                    </a>

                </td>

            `;


            table.appendChild(row);

        }
    );

}


/* =====================================================
   APPLICANT DETAILS
===================================================== */

function displayApplicantDetails() {

    const container =
        document.getElementById(
            "applicantDetails"
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


    const applications =
        getApplications();


    const application =
        applications.find(
            function(item) {

                return item.id === id;

            }
        );


    if (!application) {

        container.innerHTML = `

            <div class="details-card">

                <h1>Applicant Not Found</h1>

                <p>
                    Applicant details are not available.
                </p>

            </div>

        `;

        return;

    }


    const jobs =
        getJobs();


    const job =
        jobs.find(
            function(item) {

                return item.id ===
                    application.jobId;

            }
        );


    const jobTitle =
        job
            ? job.title
            : "Job";


    container.innerHTML = `

        <div class="details-card">

            <h1>Applicant Details</h1>


            <div class="details-info">

                <div class="info-box">

                    <strong>Name</strong>

                    ${application.name}

                </div>


                <div class="info-box">

                    <strong>Email</strong>

                    ${application.email}

                </div>


                <div class="info-box">

                    <strong>Phone</strong>

                    ${application.phone}

                </div>


                <div class="info-box">

                    <strong>Applied For</strong>

                    ${jobTitle}

                </div>


                <div class="info-box">

                    <strong>Application Date</strong>

                    ${application.date}

                </div>


                <div class="info-box">

                    <strong>Status</strong>

                    ${application.status}

                </div>

            </div>


            <h2>Resume</h2>

            <p>
                ${application.resume || "Resume not provided."}
            </p>


            <br>


            <button
                class="primary-btn"
                onclick="updateApplicationStatus(${application.id}, 'Shortlisted')"
            >
                Shortlist
            </button>


            <button
                class="secondary-btn delete-btn"
                onclick="updateApplicationStatus(${application.id}, 'Rejected')"
            >
                Reject
            </button>


            <br><br>


            <a
                href="applications.html"
                class="secondary-btn"
            >
                Back to Applications
            </a>

        </div>

    `;

}


/* =====================================================
   UPDATE APPLICATION STATUS
===================================================== */

function updateApplicationStatus(
    applicationId,
    newStatus
) {

    const applications =
        getApplications();


    const application =
        applications.find(
            function(item) {

                return item.id ===
                    applicationId;

            }
        );


    if (!application) {
        return;
    }


    application.status =
        newStatus;


    localStorage.setItem(

        "jobPortalApplications",

        JSON.stringify(applications)

    );


    alert(
        "Application status updated to " +
        newStatus
    );


    displayApplicantDetails();

}


/* =====================================================
   DASHBOARD STATS
===================================================== */

function displayDashboardStats() {

    const jobs =
        getJobs();


    const applications =
        getApplications();


    const totalJobs =
        document.getElementById(
            "totalJobs"
        );


    const activeJobs =
        document.getElementById(
            "activeJobs"
        );


    const totalApplications =
        document.getElementById(
            "totalApplications"
        );


    if (totalJobs) {

        totalJobs.textContent =
            jobs.length;

    }


    if (activeJobs) {

        activeJobs.textContent =
            jobs.filter(
                function(job) {

                    return job.status ===
                        "Active";

                }
            ).length;

    }


    if (totalApplications) {

        totalApplications.textContent =
            applications.length;

    }


    displayRecentJobs();

}


/* =====================================================
   RECENT JOBS
===================================================== */

function displayRecentJobs() {

    const container =
        document.getElementById(
            "recentJobs"
        );


    if (!container) {
        return;
    }


    const jobs =
        getJobs();


    const recentJobs =
        jobs.slice(-3).reverse();


    if (recentJobs.length === 0) {

        container.innerHTML = `

            <div class="job-card">

                <p>
                    No jobs posted yet.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    recentJobs.forEach(
        function(job) {

            container.innerHTML += `

                <div class="job-card">

                    <h3>
                        ${job.title}
                    </h3>

                    <div class="job-company">
                        ${job.company}
                    </div>

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
                        class="primary-btn"
                    >
                        View Details
                    </a>

                </div>

            `;

        }
    );

}


/* =====================================================
   INITIALIZATION
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {


        checkEmployerLogin();


        employerRegister();


        employerLogin();


        displayEmployerName();


        loadEmployerProfile();


        postJob();


        displayEmployerJobs();


        displayJobDetails();


        displayApplications();


        displayApplicantDetails();


        displayDashboardStats();

    }
);