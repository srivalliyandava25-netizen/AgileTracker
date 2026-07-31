import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTicket } from "../services/ticketApi";

function Ticket({ ticket, onDelete, isDeleting }) {
  const [showDetails, setShowDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const queryClient = useQueryClient();

  const [title, setTitle] = useState(ticket.title || "");
  const [description, setDescription] = useState(ticket.description || "");
  const [status, setStatus] = useState(ticket.status || "todo");
  const [priority, setPriority] = useState(ticket.priority || "medium");
  const [assignee, setAssignee] = useState(ticket.assignee || "");
  const [dueDate, setDueDate] = useState(ticket.dueDate || "");

  const updateMutation = useMutation({
    mutationFn: (data) => updateTicket(ticket.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tickets"],
      });

      setIsEditing(false);
      setShowDetails(false);
    },
  });

  const priorityStyles = {
    high: "bg-rose-50 text-rose-700 border-rose-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  const statusStyles = {
    todo: "bg-slate-100 text-slate-700 border-slate-200",
    "in-progress": "bg-indigo-50 text-indigo-700 border-indigo-200",
    done: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  const statusNames = {
    todo: "To Do",
    "in-progress": "In Progress",
    done: "Done",
  };

  function handleMove() {
    let nextStatus;

    if (ticket.status === "todo") {
      nextStatus = "in-progress";
    } else if (ticket.status === "in-progress") {
      nextStatus = "done";
    } else {
      return;
    }

    updateMutation.mutate({
      status: nextStatus,
    });
  }

  function handleEdit() {
    setTitle(ticket.title || "");
    setDescription(ticket.description || "");
    setStatus(ticket.status || "todo");
    setPriority(ticket.priority || "medium");
    setAssignee(ticket.assignee || "");
    setDueDate(ticket.dueDate || "");

    setIsEditing(true);
  }

  function handleSave(event) {
    event.preventDefault();

    updateMutation.mutate({
      title,
      description,
      status,
      priority,
      assignee,
      dueDate,
    });
  }

  function handleDelete() {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      onDelete(ticket.id);
      setShowDetails(false);
    }
  }

  return (
    <>
      <div
        onClick={() => setShowDetails(true)}
        className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg"
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs font-semibold text-slate-500">
            #{ticket.id}
          </span>

          <span className="text-xs text-slate-400">
            View details
          </span>
        </div>

        <h3 className="mb-2 text-base font-bold text-slate-900 group-hover:text-sky-600">
          {ticket.title}
        </h3>

        <p className="mb-5 line-clamp-2 text-sm leading-relaxed text-slate-500">
          {ticket.description || "No description"}
        </p>

        <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Status
            </p>

            <span
              className={`inline-flex rounded-md border px-2 py-1 text-xs font-semibold ${
                statusStyles[ticket.status] || statusStyles.todo
              }`}
            >
              {statusNames[ticket.status] || "Unknown"}
            </span>
          </div>

          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Priority
            </p>

            <span
              className={`inline-flex rounded-md border px-2 py-1 text-xs font-semibold capitalize ${
                priorityStyles[ticket.priority] ||
                priorityStyles.medium
              }`}
            >
              {ticket.priority || "Not set"}
            </span>
          </div>

          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Assignee
            </p>

            <p className="text-sm font-semibold text-slate-700">
              {ticket.assignee || "Unassigned"}
            </p>
          </div>

          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Due Date
            </p>

            <p className="text-sm font-semibold text-slate-700">
              {ticket.dueDate || "No date"}
            </p>
          </div>
        </div>
      </div>

      {showDetails && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
          onClick={() => {
            setShowDetails(false);
            setIsEditing(false);
          }}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl md:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            {!isEditing ? (
              <>
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
                    className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  >
                    ×
                  </button>
                </div>

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

                <div className="grid grid-cols-1 overflow-hidden rounded-xl border border-slate-200 sm:grid-cols-2">
                  <div className="border-b border-slate-200 p-5 sm:border-r">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                      Status
                    </p>

                    <span
                      className={`inline-flex rounded-lg border px-3 py-2 text-sm font-semibold ${
                        statusStyles[ticket.status] || statusStyles.todo
                      }`}
                    >
                      {statusNames[ticket.status] || "Unknown"}
                    </span>
                  </div>

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

                  <div className="border-b border-slate-200 p-5 sm:border-r">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                      Assignee
                    </p>

                    <p className="text-sm font-semibold text-slate-700">
                      {ticket.assignee || "Unassigned"}
                    </p>
                  </div>

                  <div className="border-b border-slate-200 p-5">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                      Due Date
                    </p>

                    <p className="text-sm font-semibold text-slate-700">
                      {ticket.dueDate || "No date"}
                    </p>
                  </div>

                  <div className="p-5 sm:border-r">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                      Ticket ID
                    </p>

                    <p className="font-mono text-sm font-semibold text-slate-700">
                      #{ticket.id}
                    </p>
                  </div>

                  <div className="p-5">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                      Description
                    </p>

                    <p className="text-sm text-slate-600">
                      {ticket.description || "No description"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-2 border-t border-slate-200 pt-5 sm:flex-row">
                  {ticket.status !== "done" && (
                    <button
                      type="button"
                      disabled={updateMutation.isPending}
                      onClick={handleMove}
                      className="flex-1 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {updateMutation.isPending
                        ? "Moving..."
                        : "Advance →"}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleEdit}
                    className="flex-1 rounded-lg bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-700"
                  >
                    Edit Ticket
                  </button>

                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={handleDelete}
                    className="flex-1 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-100 disabled:opacity-50"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleSave}>
                <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-sky-600">
                      Edit Ticket
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-slate-900">
                      #{ticket.id}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-slate-400 hover:bg-slate-100"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Title
                    </label>

                    <input
                      type="text"
                      value={title}
                      onChange={(event) =>
                        setTitle(event.target.value)
                      }
                      required
                      className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Status
                    </label>

                    <select
                      value={status}
                      onChange={(event) =>
                        setStatus(event.target.value)
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">
                        In Progress
                      </option>
                      <option value="done">Done</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Priority
                    </label>

                    <select
                      value={priority}
                      onChange={(event) =>
                        setPriority(event.target.value)
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Assignee
                    </label>

                    <input
                      type="text"
                      value={assignee}
                      onChange={(event) =>
                        setAssignee(event.target.value)
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Due Date
                    </label>

                    <input
                      type="date"
                      value={dueDate}
                      onChange={(event) =>
                        setDueDate(event.target.value)
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Description
                    </label>

                    <textarea
                      value={description}
                      onChange={(event) =>
                        setDescription(event.target.value)
                      }
                      rows={3}
                      className="w-full resize-none rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    />
                  </div>
                </div>

                {updateMutation.isError && (
                  <div className="mt-5 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                    {updateMutation.error?.message ||
                      "Failed to update ticket"}
                  </div>
                )}

                <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-5">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    disabled={updateMutation.isPending}
                    className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="rounded-lg bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
                  >
                    {updateMutation.isPending
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Ticket;