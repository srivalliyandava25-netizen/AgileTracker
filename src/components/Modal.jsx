import { useEffect, useRef, useState } from "react";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { updateTicket } from "../services/ticketApi";

function Modal({ ticket, onClose }) {
  const titleInputRef = useRef(null);

  const queryClient = useQueryClient();

  const [title, setTitle] = useState(ticket.title);

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

  useEffect(() => {
    titleInputRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
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
  }, [onClose]);

  function handleSubmit(event) {
    event.preventDefault();

    updateMutation.mutate({
      title,
    });
  }

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <button
          className="modal-close"
          onClick={onClose}
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
          />

          <p>
            <strong>Description:</strong>{" "}
            {ticket.description}
          </p>

          <p>
            <strong>Priority:</strong>{" "}
            {ticket.priority}
          </p>

          <p>
            <strong>Assigned to:</strong>{" "}
            {ticket.assignee}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {ticket.status}
          </p>

          <button
            type="submit"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending
              ? "Saving..."
              : "Save Changes"}
          </button>

          {updateMutation.isError && (
            <p>
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