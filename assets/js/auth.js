// Register Form

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        // Get form values

        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const phone =
            document.getElementById("phone").value.trim();

        const role =
            document.getElementById("role").value;

        const password =
            document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const message =
            document.getElementById("registerMessage");


        // Password check

        if (password !== confirmPassword) {

            message.textContent =
                "Passwords do not match.";

            message.style.color = "red";

            return;
        }


        // Password length

        if (password.length < 6) {

            message.textContent =
                "Password must contain at least 6 characters.";

            message.style.color = "red";

            return;
        }


        // Check role

        if (role === "") {

            message.textContent =
                "Please select account type.";

            message.style.color = "red";

            return;
        }


        // Temporary registration

        const user = {

            name: name,

            email: email,

            phone: phone,

            role: role

        };


        // Store data temporarily

        localStorage.setItem(
            "registeredUser",
            JSON.stringify(user)
        );


        message.textContent =
            "Registration successful!";

        message.style.color = "green";


        // Clear form

        registerForm.reset();

    });

}