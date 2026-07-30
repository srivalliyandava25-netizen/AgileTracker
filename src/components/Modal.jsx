import { useEffect, useRef, useState } from "react";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { updateTicket } from "../services/ticketApi";

function Modal({ ticket, onClose }) {
  const titleInputRef = useRef(null);

  const queryClient = useQueryClient();

  const [title, setTitle] = useState(ticket.title || "");
  const [description, setDescription] = useState(
    ticket.description || ""
  );
  const [status, setStatus] = useState(
    ticket.status || "todo"
  );
  const [priority, setPriority] = useState(
    ticket.priority || "medium"
  );
  const [assignee, setAssignee] = useState(
    ticket.assignee || ""
  );
  const [dueDate, setDueDate] = useState(
    ticket.dueDate || ""
  );

  const updateMutation = useMutation({
    mutationFn: (updatedData) =>
      updateTicket(ticket.id, updatedData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tickets"],
      });

      onClose();
    },
  });

  const hasChanges =
    title !== (ticket.title || "") ||
    description !== (ticket.description || "") ||
    status !== (ticket.status || "todo") ||
    priority !== (ticket.priority || "medium") ||
    assignee !== (ticket.assignee || "") ||
    dueDate !== (ticket.dueDate || "");

  function handleClose() {
    if (!hasChanges || updateMutation.isPending) {
      onClose();
      return;
    }

    const confirmed = window.confirm(
      "You have unsaved changes. Discard them?"
    );

    if (confirmed) {
      onClose();
    }
  }

  useEffect(() => {
    titleInputRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  });

  function handleSubmit(event) {
    event.preventDefault();

    const updatedData = {
      title,
      description,
      status,
      priority,
      assignee,
      dueDate,
    };

    updateMutation.mutate(updatedData);
  }

  return (
    <div
      className="modal-overlay"
      onClick={handleClose}
    >
      <div
        className="modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <button
          type="button"
          className="modal-close"
          onClick={handleClose}
        >
          ×
        </button>

        <h2>Edit Ticket</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="title">
            Title
          </label>

          <input
            ref={titleInputRef}
            id="title"
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            required
          />

          <label htmlFor="description">
            Description
          </label>

          <textarea
            id="description"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            required
          />

          <label htmlFor="status">
            Status
          </label>

          <select
            id="status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
          >
            <option value="todo">
              To Do
            </option>

            <option value="in-progress">
              In Progress
            </option>

            <option value="done">
              Done
            </option>
          </select>

          <label htmlFor="priority">
            Priority
          </label>

          <select
            id="priority"
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value)
            }
          >
            <option value="low">
              Low
            </option>

            <option value="medium">
              Medium
            </option>

            <option value="high">
              High
            </option>
          </select>

          <label htmlFor="assignee">
            Assignee
          </label>

          <input
            id="assignee"
            type="text"
            value={assignee}
            onChange={(event) =>
              setAssignee(event.target.value)
            }
            required
          />

          <label htmlFor="dueDate">
            Due Date
          </label>

          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(event) =>
              setDueDate(event.target.value)
            }
            required
          />

          <button
            type="submit"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending
              ? "Saving..."
              : "Save Changes"}
          </button>

          {updateMutation.isError && (
            <p className="error">
              Error:{" "}
              {updateMutation.error.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Modal;