
import { useState } from "react";
import Modal from "./Modal";
import { useUpdateTicket } from "../hooks/useUpdateTicket";

function Ticket({ ticket, onDelete, isDeleting }) {
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

    if (window.confirm(`Move this ticket to ${nextStatusName}?`)) {
      updateMutation.mutate({
        ticketId: ticket.id,
        updatedData: {
          status: nextStatus,
        },
      });
    }
  }

  function handleEdit(event) {
    event.stopPropagation();
    setShowModal(true);
  }

  function handleDelete(event) {
    event.stopPropagation();

    if (window.confirm("Are you sure you want to delete this ticket?")) {
      onDelete(ticket.id);
    }
  }

  const priorityStyles = {
    high: "bg-rose-50 text-rose-700 border-rose-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    low: "bg-slate-100 text-slate-600 border-slate-200",
  };

  const statusStyles = {
    todo: "bg-slate-100 text-slate-700 border-slate-200",
    "in-progress":
      "bg-indigo-50 text-indigo-700 border-indigo-200",
    done: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  const statusName =
    ticket.status === "todo"
      ? "To Do"
      : ticket.status === "in-progress"
      ? "In Progress"
      : "Done";

  return (
    <>
      <div className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md">

        {/* =========================
            ID
        ========================== */}

        <div className="mb-3">
          <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-semibold text-slate-500">
            #{ticket.id}
          </span>
        </div>

        {/* =========================
            TITLE
        ========================== */}

        <h3 className="mb-2 text-base font-bold text-slate-900 group-hover:text-indigo-600">
          {ticket.title}
        </h3>

        {/* =========================
            DESCRIPTION
        ========================== */}

        <p className="mb-4 text-sm leading-relaxed text-slate-600">
          {ticket.description || "No description"}
        </p>

        {/* =========================
            DETAILS
        ========================== */}

        <div className="space-y-2 border-t border-slate-100 pt-3">

          {/* STATUS */}

          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Status
            </span>

            <span
              className={`rounded-md border px-2 py-1 text-xs font-semibold ${
                statusStyles[ticket.status] || statusStyles.todo
              }`}
            >
              {statusName}
            </span>
          </div>

          {/* PRIORITY */}

          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Priority
            </span>

            <span
              className={`rounded-md border px-2 py-1 text-xs font-semibold capitalize ${
                priorityStyles[ticket.priority] || priorityStyles.low
              }`}
            >
              {ticket.priority || "low"}
            </span>
          </div>

          {/* ASSIGNEE */}

          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Assignee
            </span>

            <div className="flex items-center gap-2">

              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold uppercase text-indigo-700">
                {(ticket.assignee || "U").slice(0, 1)}
              </div>

              <span className="text-sm font-medium text-slate-700">
                {ticket.assignee || "Unassigned"}
              </span>

            </div>
          </div>

        </div>

        {/* =========================
            ACTIONS
        ========================== */}

        <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">

          {ticket.status !== "done" && (
            <button
              type="button"
              disabled={isUpdating}
              onClick={handleMove}
              className="flex-1 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100 disabled:opacity-50"
            >
              {isUpdating ? "Moving..." : "Advance →"}
            </button>
          )}

          <button
            type="button"
            disabled={isDeleting}
            onClick={handleEdit}
            className="flex-1 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50"
          >
            Edit
          </button>

          <button
            type="button"
            disabled={isDeleting}
            onClick={handleDelete}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
          >
            {isDeleting ? "..." : "Delete"}
          </button>

        </div>
      </div>

      {/* EDIT MODAL */}

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
