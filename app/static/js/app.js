const searchInput = document.getElementById("search-input");
const statusFilter = document.getElementById("status-filter");
const ticketTableBody = document.getElementById("ticket-table-body");
const emptyState = document.getElementById("empty-state");

const totalCount = document.getElementById("total-count");
const openCount = document.getElementById("open-count");
const progressCount = document.getElementById("progress-count");
const closedCount = document.getElementById("closed-count");

const newTicketButton = document.getElementById("new-ticket-btn");
async function loadTickets() {

    const search = searchInput.value.trim();
    const status = statusFilter.value;

    const params = new URLSearchParams();

    if (search) {
        params.append("search", search);
    }

    if (status) {
        params.append("status", status);
    }

    const queryString = params.toString();

    const url = queryString
        ? `/api/tickets/?${queryString}`
        : "/api/tickets/";


    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to load tickets");
        }

        const tickets = await response.json();

        renderTickets(tickets);

        await updateStatistics();

    } catch (error) {

        console.error(error);

        ticketTableBody.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    class="text-center py-10 text-red-500"
                >
                    Failed to load tickets.
                </td>
            </tr>
        `;
    }
}


function renderTickets(tickets) {

    ticketTableBody.innerHTML = "";

    if (tickets.length === 0) {

        emptyState.classList.remove("hidden");

        return;
    }

    emptyState.classList.add("hidden");


    tickets.forEach(ticket => {

        const row = document.createElement("tr");

        row.className =
            "hover:bg-slate-50 cursor-pointer transition";


        row.innerHTML = `

            <td class="px-6 py-4">

                <span class="font-semibold text-slate-900">
                    ${escapeHtml(ticket.ticket_id)}
                </span>

            </td>


            <td class="px-6 py-4">

                <p class="font-medium">
                    ${escapeHtml(ticket.customer_name)}
                </p>

            </td>


            <td class="px-6 py-4">

                <p class="text-slate-700">
                    ${escapeHtml(ticket.subject)}
                </p>

            </td>


            <td class="px-6 py-4">
                ${getPriorityBadge(ticket.priority)}
            </td>

            <td class="px-6 py-4">
                ${getStatusBadge(ticket.status)}
            </td>


            <td class="px-6 py-4 text-sm text-slate-500">

                ${formatDate(ticket.created_at)}

            </td>

        `;


        row.addEventListener("click", () => {

            window.location.href =
                `/ticket/${ticket.ticket_id}`;

        });


        ticketTableBody.appendChild(row);

    });
}


function getStatusBadge(status) {

    const styles = {

        "Open":
            "bg-blue-50 text-blue-700",

        "In Progress":
            "bg-amber-50 text-amber-700",

        "Closed":
            "bg-emerald-50 text-emerald-700"

    };


    const style =
        styles[status] || "bg-slate-100 text-slate-700";


    return `
        <span
            class="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${style}"
        >
            ${status}
        </span>
    `;
}


function formatDate(dateString) {

    if (!dateString) {
        return "-";
    }

    const utcDate = new Date(
        dateString.endsWith("Z")
            ? dateString
            : `${dateString}Z`
    );

    return utcDate.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


async function updateStatistics() {

    try {

        const response =
            await fetch("/api/tickets/");

        if (!response.ok) {
            throw new Error("Failed to load statistics");
        }

        const tickets =
            await response.json();


        totalCount.textContent =
            tickets.length;


        openCount.textContent =
            tickets.filter(
                ticket => ticket.status === "Open"
            ).length;


        progressCount.textContent =
            tickets.filter(
                ticket => ticket.status === "In Progress"
            ).length;


        closedCount.textContent =
            tickets.filter(
                ticket => ticket.status === "Closed"
            ).length;


    } catch (error) {

        console.error(
            "Failed to update statistics:",
            error
        );

    }
}

let searchTimeout;

searchInput.addEventListener("input", () => {

    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {

        loadTickets();

    }, 250);

});


statusFilter.addEventListener("change", () => {

    loadTickets();

});

newTicketButton.addEventListener("click", () => {

    window.location.href = "/create-ticket";

});

loadTickets();

function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}

function getPriorityBadge(priority) {

    const styles = {

        "Low":
            "bg-slate-100 text-slate-600",

        "Medium":
            "bg-blue-50 text-blue-700",

        "High":
            "bg-red-50 text-red-700"

    };


    const style =
        styles[priority] ||
        "bg-slate-100 text-slate-700";


    return `
        <span
            class="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${style}"
        >
            ${escapeHtml(priority)}
        </span>
    `;
}