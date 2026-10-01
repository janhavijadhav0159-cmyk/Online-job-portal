document.addEventListener("DOMContentLoaded", function () {

    /* ================= HOME SEARCH ================= */

    const homeSearch = document.getElementById("homeSearch");

    if (homeSearch) {

        homeSearch.addEventListener("submit", function (event) {

            event.preventDefault();

            const job =
                document.getElementById("homeJob").value.trim();

            const location =
                document.getElementById("homeLocation").value.trim();

            const url =
                "jobs.html?job=" +
                encodeURIComponent(job) +
                "&location=" +
                encodeURIComponent(location);

            window.location.href = url;

        });

    }


    /* ================= JOB SEARCH ================= */

    const searchButton =
        document.getElementById("jobSearchButton");

    if (searchButton) {

        searchButton.addEventListener("click", filterJobs);

    }


    const filterLocation =
        document.getElementById("filterLocation");

    const filterType =
        document.getElementById("filterType");

    if (filterLocation) {
        filterLocation.addEventListener("input", filterJobs);
    }

    if (filterType) {
        filterType.addEventListener("change", filterJobs);
    }


    /* ================= CLEAR FILTER ================= */

    const clearButton =
        document.getElementById("clearFilters");

    if (clearButton) {

        clearButton.addEventListener("click", function () {

            const jobSearch =
                document.getElementById("jobSearch");

            const locationSearch =
                document.getElementById("locationSearch");

            const jobType =
                document.getElementById("jobType");

            if (jobSearch) jobSearch.value = "";
            if (locationSearch) locationSearch.value = "";
            if (jobType) jobType.value = "";

            if (filterLocation) {
                filterLocation.value = "";
            }

            if (filterType) {
                filterType.value = "";
            }

            showAllJobs();

        });

    }


    /* ================= CONTACT FORM ================= */

    const contactForm =
        document.getElementById("contactForm");

    if (contactForm) {

        contactForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const name =
                document.getElementById("contactName").value.trim();

            const email =
                document.getElementById("contactEmail").value.trim();

            const message =
                document.getElementById("contactMessage").value.trim();

            const status =
                document.getElementById("contactMessageStatus");

            if (!name || !email || !message) {

                status.textContent =
                    "Please fill all required fields.";

                status.style.color = "red";

                return;
            }

            status.textContent =
                "Thank you! Your message has been submitted.";

            status.style.color = "green";

            contactForm.reset();

        });

    }


    /* ================= URL SEARCH ================= */

    loadSearchFromURL();

});


/* ================= FILTER JOBS ================= */

function filterJobs() {

    const titleElement =
        document.getElementById("jobSearch");

    const locationElement =
        document.getElementById("locationSearch");

    const typeElement =
        document.getElementById("jobType");

    const filterLocationElement =
        document.getElementById("filterLocation");

    const filterTypeElement =
        document.getElementById("filterType");


    const title =
        titleElement
            ? titleElement.value.toLowerCase().trim()
            : "";

    const location =
        locationElement
            ? locationElement.value.toLowerCase().trim()
            : "";

    const type =
        typeElement
            ? typeElement.value.toLowerCase()
            : "";


    const filterLocation =
        filterLocationElement
            ? filterLocationElement.value.toLowerCase().trim()
            : "";

    const filterType =
        filterTypeElement
            ? filterTypeElement.value.toLowerCase()
            : "";


    const cards =
        document.querySelectorAll(".job-card");


    cards.forEach(function (card) {

        const cardTitle =
            card.dataset.title.toLowerCase();

        const cardLocation =
            card.dataset.location.toLowerCase();

        const cardType =
            card.dataset.type.toLowerCase();


        const titleMatch =
            !title || cardTitle.includes(title);

        const locationMatch =
            !location || cardLocation.includes(location);

        const typeMatch =
            !type || cardType === type;


        const filterLocationMatch =
            !filterLocation ||
            cardLocation.includes(filterLocation);

        const filterTypeMatch =
            !filterType ||
            cardType === filterType;


        if (
            titleMatch &&
            locationMatch &&
            typeMatch &&
            filterLocationMatch &&
            filterTypeMatch
        ) {

            card.style.display = "block";

        } else {

            card.style.display = "none";

        }

    });

}


/* ================= SHOW ALL JOBS ================= */

function showAllJobs() {

    const cards =
        document.querySelectorAll(".job-card");

    cards.forEach(function (card) {

        card.style.display = "block";

    });

}


/* ================= LOAD SEARCH FROM URL ================= */

function loadSearchFromURL() {

    if (!window.location.pathname.endsWith("jobs.html")) {
        return;
    }

    const params =
        new URLSearchParams(window.location.search);

    const job =
        params.get("job");

    const location =
        params.get("location");


    const jobSearch =
        document.getElementById("jobSearch");

    const locationSearch =
        document.getElementById("locationSearch");


    if (job && jobSearch) {
        jobSearch.value = job;
    }

    if (location && locationSearch) {
        locationSearch.value = location;
    }


    if (job || location) {
        filterJobs();
    }

}