import { useState } from "react";
import Modal from "./Modal";
import { useUpdateTicket } from "../hooks/useUpdateTicket";

function Ticket({ ticket }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

const updateTicketMutation = useUpdateTicket();
  function handleOpenModal() {
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  function handleMove() {
  console.log("Move clicked");

  let nextStatus;

  if (ticket.status === "todo") {
    nextStatus = "in-progress";
  } else if (ticket.status === "in-progress") {
    nextStatus = "done";
  } else {
    return;
  }

  console.log(nextStatus);

  updateTicketMutation.mutate({
    ticketId: ticket.id,
    updatedData: {
      status: nextStatus,
    },
  });
}

  return (
    <>
      <div className="ticket" onClick={handleOpenModal}>
        <h3>{ticket.title}</h3>
        <p>{ticket.description}</p>

        <div className="ticket-details">
          <span>Priority: {ticket.priority}</span>
          <span>Assigned to: {ticket.assignee}</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleMove();
          }}
        >
          Move
        </button>
      </div>

      {isModalOpen && (
        <Modal
          ticket={ticket}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}

export default Ticket;