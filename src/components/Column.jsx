import Ticket from "./Ticket";

function Column({ title, tickets, onDelete, deletingTicketId }) {
  return (
    <div className="column">
      <div className="column-header">
        <h2>{title}</h2>
        <span>{tickets.length}</span>
      </div>

      <div className="column-content">
        {tickets.length === 0 ? (
          <p>No tickets</p>
        ) : (
          tickets.map((ticket) => (
            <Ticket
              key={ticket.id}
              ticket={ticket}
              onDelete={onDelete}
              isDeleting={deletingTicketId === ticket.id}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Column;