const form = document.getElementById("create-ticket-form");

const submitButton = document.getElementById("submit-button");

const formError = document.getElementById("form-error");


form.addEventListener("submit", async (event) => {

    event.preventDefault();


    formError.classList.add("hidden");

    submitButton.disabled = true;

    submitButton.textContent = "Creating...";


    const ticketData = {

        customer_name:
            document.getElementById("customer-name").value.trim(),

        customer_email:
            document.getElementById("customer-email").value.trim(),

        subject:
            document.getElementById("subject").value.trim(),

        description:
            document.getElementById("description").value.trim()

    };


    try {

        const response = await fetch(
            "/api/tickets/",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(ticketData)
            }
        );


        const data = await response.json();


        if (!response.ok) {

            if (data.detail) {

                if (Array.isArray(data.detail)) {

                    formError.textContent =
                        data.detail
                            .map(error => error.msg)
                            .join(", ");

                } else {

                    formError.textContent = data.detail;

                }

            } else {

                formError.textContent =
                    "Unable to create ticket.";

            }

            formError.classList.remove("hidden");

            return;
        }


        window.location.href =
            `/ticket/${data.ticket_id}`;


    } catch (error) {

        console.error(error);

        formError.textContent =
            "Something went wrong. Please try again.";

        formError.classList.remove("hidden");

    } finally {

        submitButton.disabled = false;

        submitButton.textContent = "Create Ticket";

    }

});