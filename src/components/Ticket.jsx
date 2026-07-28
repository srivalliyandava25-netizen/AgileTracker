import { useState } from "react"
import Modal from "./Modal"

function Ticket({ ticket }) {
    const [isModalOpen, setIsModalOpen] = useState(false);


    function handleOpenModal() {
        setIsModalOpen(true);
    }

    function handleCloseModal() {
        setIsModalOpen(false);
    }

    return (
        <>
        <div className="ticket" 
        onClick={handleOpenModal}  >
            <h3>{ticket.title}</h3>
            <p>{ticket.description}</p>

            <div className="ticket-details">
              <span>Priority: {ticket.priority}</span>
              <span>Assigned to: {ticket.assignee}</span>
            </div>
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

export default Ticket