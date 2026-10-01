/* =========================================================
   JOB PORTAL - COMMON JAVASCRIPT
   ========================================================= */

"use strict";


/* =========================
   DOM READY
   ========================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeCurrentYear();
    initializeMobileMenu();
    initializeSmoothLinks();

});


/* =========================
   CURRENT YEAR
   ========================= */

function initializeCurrentYear() {

    const yearElement =
        document.getElementById("currentYear");

    if (yearElement) {
        yearElement.textContent =
            new Date().getFullYear();
    }

}


/* =========================
   MOBILE MENU
   ========================= */

function initializeMobileMenu() {

    const menuButton =
        document.getElementById("mobileMenuBtn");

    const nav =
        document.querySelector(".main-nav");

    const actions =
        document.querySelector(".nav-actions");

    if (!menuButton || !nav) {
        return;
    }


    menuButton.addEventListener("click", () => {

        nav.classList.toggle("mobile-open");

        if (actions) {
            actions.classList.toggle("mobile-open");
        }

        menuButton.classList.toggle("active");

        if (nav.classList.contains("mobile-open")) {
            menuButton.innerHTML = "✕";
        } else {
            menuButton.innerHTML = "☰";
        }

    });

}


/* =========================
   SMOOTH ANCHOR LINKS
   ========================= */

function initializeSmoothLinks() {

    const links =
        document.querySelectorAll(
            'a[href^="#"]'
        );

    links.forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetId =
                link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target =
                document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });

}


/* =========================
   LOCAL STORAGE HELPERS
   ========================= */

function getStorageItem(key, fallback = null) {

    try {

        const value =
            localStorage.getItem(key);

        if (value === null) {
            return fallback;
        }

        return JSON.parse(value);

    } catch (error) {

        console.error(
            "Unable to read localStorage:",
            error
        );

        return fallback;

    }

}


function setStorageItem(key, value) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

        return true;

    } catch (error) {

        console.error(
            "Unable to write localStorage:",
            error
        );

        return false;

    }

}


function removeStorageItem(key) {

    try {

        localStorage.removeItem(key);

        return true;

    } catch (error) {

        console.error(
            "Unable to remove localStorage:",
            error
        );

        return false;

    }

}


/* =========================
   TOAST NOTIFICATION
   ========================= */

function showToast(
    message,
    type = "success"
) {

    let container =
        document.querySelector(".toast-container");


    if (!container) {

        container =
            document.createElement("div");

        container.className =
            "toast-container";

        document.body.appendChild(container);

    }


    const toast =
        document.createElement("div");

    toast.className =
        `toast toast-${type}`;

    toast.textContent = message;


    container.appendChild(toast);


    setTimeout(() => {

        toast.classList.add("hide");

        setTimeout(() => {
            toast.remove();
        }, 300);

    }, 2500);

}


/* =========================
   DEBOUNCE
   ========================= */

function debounce(
    callback,
    delay = 300
) {

    let timeout;

    return function (...args) {

        clearTimeout(timeout);

        timeout = setTimeout(() => {

            callback.apply(this, args);

        }, delay);

    };

}


/* =========================
   FORMAT NUMBER
   ========================= */

function formatNumber(number) {

    return new Intl.NumberFormat(
        "en-IN"
    ).format(number);

}