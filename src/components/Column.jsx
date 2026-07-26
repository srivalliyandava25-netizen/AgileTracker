import Ticket from './Ticket'

function Column({ title, tickets }) {
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
            <div key={ticket.id}>
              {ticket.title}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Column;