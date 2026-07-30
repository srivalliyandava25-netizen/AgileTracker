
import { useState } from "react";
import Modal from "./Modal";
import { useUpdateTicket } from "../hooks/useUpdateTicket";

function Ticket({
  ticket,
  onDelete,
  isDeleting,
}) {
  const [showModal, setShowModal] = useState(false);

  const updateMutation = useUpdateTicket();

  const isUpdating = updateMutation.isPending;

  function handleMove(event) {
    event.stopPropagation();

    let nextStatus;
    let nextStatusName;

    if (ticket.status === "todo") {
      nextStatus = "in-progress";
      nextStatusName = "In Progress";
    } else if (ticket.status === "in-progress") {
      nextStatus = "done";
      nextStatusName = "Done";
    } else {
      return;
    }

    const confirmed = window.confirm(
      `Move this ticket to ${nextStatusName}?`
    );

    if (!confirmed) {
      return;
    }

    updateMutation.mutate({
      ticketId: ticket.id,
      updatedData: {
        status: nextStatus,
      },
    });
  }

  function handleEdit(event) {
    event.stopPropagation();
    setShowModal(true);
  }

  function handleDelete(event) {
    event.stopPropagation();

    if (
      window.confirm(
        "Are you sure you want to delete this ticket?"
      )
    ) {
      onDelete(ticket.id);
    }
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = ticket.dueDate
    ? new Date(ticket.dueDate)
    : null;

  if (dueDate) {
    dueDate.setHours(0, 0, 0, 0);
  }

  const isOverdue =
    dueDate &&
    dueDate < today &&
    ticket.status !== "done";

  const isDueToday =
    dueDate &&
    dueDate.getTime() === today.getTime() &&
    ticket.status !== "done";

  return (
    <>
      <div className="ticket-card">
        <h3>{ticket.title}</h3>

        <p>{ticket.description}</p>

        <div className="ticket-details">
          <span
            className={`status-badge ${ticket.status}`}
          >
            {ticket.status === "todo"
              ? "To Do"
              : ticket.status === "in-progress"
              ? "In Progress"
              : "Done"}
          </span>

          <span
            className={`priority-badge ${ticket.priority}`}
          >
            Priority: {ticket.priority}
          </span>

          <span>
            Assigned to:{" "}
            {ticket.assignee || "Unassigned"}
          </span>

          <span
            className={
              isOverdue
                ? "due-date overdue"
                : isDueToday
                ? "due-date due-today"
                : "due-date"
            }
          >
            Due:{" "}
            {isOverdue
              ? "Overdue"
              : isDueToday
              ? "Today"
              : ticket.dueDate || "No due date"}
          </span>
        </div>

        <div className="ticket-actions">
          {ticket.status !== "done" && (
            <button
              type="button"
              disabled={isUpdating}
              onClick={handleMove}
            >
              {isUpdating
                ? "Moving..."
                : "Move"}
            </button>
          )}

          <button
            type="button"
            disabled={isDeleting}
            onClick={handleEdit}
          >
            Edit
          </button>

          <button
            type="button"
            disabled={isDeleting}
            onClick={handleDelete}
          >
            {isDeleting
              ? "Deleting..."
              : "Delete"}
          </button>
        </div>
      </div>

      {showModal && (
        <Modal
          ticket={ticket}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

export default Ticket;
