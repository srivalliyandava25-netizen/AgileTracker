
import { useState } from "react";
import Modal from "./Modal";
import { useUpdateTicket } from "../hooks/useUpdateTicket";

function Ticket({ ticket, onDelete, isDeleting }) {
  const [showDetails, setShowDetails] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const updateMutation = useUpdateTicket();
  const isUpdating = updateMutation.isPending;

  const priorityStyles = {
    high: "bg-rose-50 text-rose-700 border-rose-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  const statusStyles = {
    todo: "bg-slate-100 text-slate-700 border-slate-200",
    "in-progress": "bg-blue-50 text-blue-700 border-blue-200",
    done: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  const statusName = {
    todo: "To Do",
    "in-progress": "In Progress",
    done: "Done",
  };

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
    setShowDetails(false);
    setShowEditModal(true);
  }

  function handleDelete(event) {
    event.stopPropagation();

    if (window.confirm("Are you sure you want to delete this ticket?")) {
      onDelete(ticket.id);
      setShowDetails(false);
    }
  }

  function handleCardClick() {
    setShowDetails(true);
  }

  return (
    <>
      {/* =================================================
          SMALL TICKET CARD
      ================================================== */}

      <div
        onClick={handleCardClick}
        className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg"
      >

        {/* ID */}

        <div className="mb-3 flex items-center justify-between">
          <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-[11px] font-semibold text-slate-500">
            #{ticket.id}
          </span>

          <span className="text-[10px] font-medium text-slate-400">
            Click to view
          </span>
        </div>

        {/* TITLE */}

        <h3 className="text-sm font-bold leading-snug text-slate-800 group-hover:text-sky-600">
          {ticket.title}
        </h3>

        {/* DESCRIPTION */}

        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">
          {ticket.description || "No description"}
        </p>

        {/* SMALL DETAILS */}

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">

          <span
            className={`rounded-md border px-2 py-1 text-[10px] font-semibold ${
              statusStyles[ticket.status] || statusStyles.todo
            }`}
          >
            {statusName[ticket.status] || "Unknown"}
          </span>

          <span
            className={`rounded-md border px-2 py-1 text-[10px] font-semibold capitalize ${
              priorityStyles[ticket.priority] || priorityStyles.medium
            }`}
          >
            {ticket.priority || "Not set"}
          </span>

        </div>
      </div>


      {/* =================================================
          LARGE TICKET DETAILS MODAL
      ================================================== */}

      {showDetails && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
          onClick={() => setShowDetails(false)}
        >

          <div
            className="relative w-full max-w-3xl rounded-2xl border border-slate-700 bg-white p-6 shadow-2xl md:p-8"
            onClick={(event) => event.stopPropagation()}
          >

            {/* HEADER */}

            <div className="mb-6 flex items-start justify-between border-b border-slate-200 pb-5">

              <div>

                <span className="mb-2 inline-block rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-semibold text-slate-500">
                  Ticket #{ticket.id}
                </span>

                <h2 className="text-2xl font-bold text-slate-900">
                  {ticket.title}
                </h2>

              </div>

              <button
                type="button"
                onClick={() => setShowDetails(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                ×
              </button>

            </div>


            {/* DESCRIPTION */}

            <div className="mb-6">

              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                Description
              </p>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                <p className="text-sm leading-relaxed text-slate-700">
                  {ticket.description || "No description available."}
                </p>

              </div>

            </div>


            {/* DETAILS */}

            <div className="grid grid-cols-1 overflow-hidden rounded-xl border border-slate-200 sm:grid-cols-2">

              {/* STATUS */}

              <div className="border-b border-slate-200 p-5 sm:border-r">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Status
                </p>

                <span
                  className={`inline-flex items-center rounded-lg border px-3 py-2 text-sm font-semibold ${
                    statusStyles[ticket.status] || statusStyles.todo
                  }`}
                >
                  <span className="mr-2 h-2 w-2 rounded-full bg-current" />
                  {statusName[ticket.status] || "Unknown"}
                </span>
              </div>


              {/* PRIORITY */}

              <div className="border-b border-slate-200 p-5">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Priority
                </p>

                <span
                  className={`inline-flex rounded-lg border px-3 py-2 text-sm font-semibold capitalize ${
                    priorityStyles[ticket.priority] ||
                    priorityStyles.medium
                  }`}
                >
                  {ticket.priority || "Not set"}
                </span>
              </div>


              {/* ASSIGNEE */}

              <div className="p-5 sm:border-r sm:border-slate-200">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Assignee
                </p>

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 font-bold uppercase text-sky-700">
                    {(ticket.assignee || "U").charAt(0)}
                  </div>

                  <span className="text-sm font-semibold text-slate-700">
                    {ticket.assignee || "Unassigned"}
                  </span>

                </div>
              </div>


              {/* ID */}

              <div className="p-5">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Ticket ID
                </p>

                <span className="font-mono text-sm font-semibold text-slate-700">
                  #{ticket.id}
                </span>
              </div>

            </div>


            {/* ACTIONS */}

            <div className="mt-6 flex flex-col gap-2 border-t border-slate-200 pt-5 sm:flex-row">

              {/* MOVE */}

              {ticket.status !== "done" && (
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={handleMove}
                  className="flex-1 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isUpdating ? "Moving..." : "Move →"}
                </button>
              )}

              {/* EDIT */}

              <button
                type="button"
                onClick={handleEdit}
                className="flex-1 rounded-lg bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                Edit Ticket
              </button>

              {/* DELETE */}

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="flex-1 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>

            </div>

          </div>
        </div>
      )}


      {/* =================================================
          EDIT MODAL
      ================================================== */}

      {showEditModal && (
        <Modal
          ticket={ticket}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
}

export default Ticket;
