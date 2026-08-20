const ticketId = window.location.pathname.split("/").pop();

const loading = document.getElementById("loading");
const errorState = document.getElementById("error-state");
const ticketContent = document.getElementById("ticket-content");
const ticketIdHeader = document.getElementById("ticket-id-header");
const ticketIdElement = document.getElementById("ticket-id");
const ticketSubject = document.getElementById("ticket-subject");
const customerName = document.getElementById("customer-name");
const customerEmail = document.getElementById("customer-email");
const createdAt = document.getElementById("created-at");
const updatedAt = document.getElementById("updated-at");
const ticketDescription = document.getElementById("ticket-description");
const ticketStatusBadge = document.getElementById("ticket-status-badge");
const statusSelect = document.getElementById("status");
const noteInput = document.getElementById("note");
const notesList = document.getElementById("notes-list");
const notesCount = document.getElementById("notes-count");
const updateButton = document.getElementById("update-button");
const updateError = document.getElementById("update-error");
const updateSuccess = document.getElementById("update-success");
const ticketPriorityBadge =
    document.getElementById("ticket-priority-badge");

const prioritySelect =
    document.getElementById("priority");
async function loadTicket() {
    try {
        const response = await fetch(`/api/tickets/${ticketId}`);

        if (!response.ok) {
            throw new Error("Ticket not found");
        }

        const ticket = await response.json();
        renderTicket(ticket);

        loading.classList.add("hidden");
        ticketContent.classList.remove("hidden");
    } catch (error) {
        console.error(error);

        loading.classList.add("hidden");
        errorState.classList.remove("hidden");
    }
}

function renderTicket(ticket) {
    ticketIdHeader.textContent = ticket.ticket_id;
    ticketIdElement.textContent = ticket.ticket_id;
    ticketSubject.textContent = ticket.subject;
    customerName.textContent = ticket.customer_name;
    customerEmail.textContent = ticket.customer_email;
    createdAt.textContent = formatDateTime(ticket.created_at);
    updatedAt.textContent = formatDateTime(ticket.updated_at);
    ticketDescription.textContent = ticket.description;

    statusSelect.value = ticket.status;
    prioritySelect.value = ticket.priority;
    ticketStatusBadge.innerHTML = getStatusBadge(ticket.status);
    ticketPriorityBadge.innerHTML =getPriorityBadge(ticket.priority);
    
    renderNotes(ticket.notes);
}

function renderNotes(notes) {
    notesList.innerHTML = "";

    notesCount.textContent =
        `${notes.length} ${notes.length === 1 ? "note" : "notes"}`;

    if (notes.length === 0) {
        notesList.innerHTML = `
            <div class="text-center py-8 text-slate-500 text-sm">
                No internal notes yet.
            </div>
        `;

        return;
    }

    notes.forEach(note => {
        const noteElement = document.createElement("div");

        noteElement.className =
            "border border-slate-200 rounded-lg p-4";

        noteElement.innerHTML = `
            <p class="text-slate-700 whitespace-pre-wrap">
                ${escapeHtml(note.note_text)}
            </p>
            <p class="text-xs text-slate-500 mt-3">
                ${formatDateTime(note.created_at)}
            </p>
        `;

        notesList.appendChild(noteElement);
    });
}

function getStatusBadge(status) {
    const styles = {
        "Open": "bg-blue-50 text-blue-700",
        "In Progress": "bg-amber-50 text-amber-700",
        "Closed": "bg-emerald-50 text-emerald-700"
    };

    const style =
        styles[status] || "bg-slate-100 text-slate-700";

    return `
        <span
            class="inline-flex px-3 py-1.5 rounded-full text-sm font-semibold ${style}"
        >
            ${status}
        </span>
    `;
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
            class="inline-flex px-3 py-1.5 rounded-full text-sm font-semibold ${style}"
        >
            ${escapeHtml(priority)}
        </span>
    `;
}

function formatDateTime(dateString) {

    if (!dateString) {
        return "-";
    }

    const utcDate = new Date(
        dateString.endsWith("Z")
            ? dateString
            : `${dateString}Z`
    );

    return utcDate.toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}

function escapeHtml(value) {
    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}

async function updateTicket() {
    updateError.classList.add("hidden");
    updateSuccess.classList.add("hidden");

    const status = statusSelect.value;
    const priority = prioritySelect.value;
    const notes = noteInput.value.trim();

    updateButton.disabled = true;
    updateButton.textContent = "Saving...";

    try {
        const response = await fetch(
            `/api/tickets/${ticketId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status,
                    priority,
                    notes: notes || null
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.detail ||
                "Failed to update ticket"
            );
        }

        updateSuccess.classList.remove("hidden");
        noteInput.value = "";

        await loadTicket();
    } catch (error) {
        console.error(error);

        updateError.textContent = error.message;
        updateError.classList.remove("hidden");
    } finally {
        updateButton.disabled = false;
        updateButton.textContent = "Save Changes";
    }
}

updateButton.addEventListener(
    "click",
    updateTicket
);

loadTicket();