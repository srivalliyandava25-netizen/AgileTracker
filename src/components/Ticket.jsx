function Ticket({ ticket }) {
    return (
        <div className="ticket">
            <h3>{ticket.title}</h3>
            <p>{ticket.description}</p>
            <div className="ticket-details">
              <span>Priority: {ticket.priority}</span>

              <span>Assigned to: {ticket.assignee}</span>
            </div>
        </div>
    )
}

export default Ticket