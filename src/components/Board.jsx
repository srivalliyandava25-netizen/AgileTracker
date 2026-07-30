import Column from "./Column";

function Board({
  tickets = [],
  onDelete,
  deletingTicketId,
}) {
  const todoTickets = tickets.filter(
    (ticket) => ticket.status === "todo"
  );

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "in-progress"
  );

  const doneTickets = tickets.filter(
    (ticket) => ticket.status === "done"
  );

  const validStatuses = [
    "todo",
    "in-progress",
    "done",
  ];

  const uncategorizedTickets = tickets.filter(
    (ticket) =>
      !validStatuses.includes(ticket.status)
  );

  return (
    <div className="board">
      <Column
        title="To Do"
        tickets={todoTickets}
        onDelete={onDelete}
        deletingTicketId={deletingTicketId}
      />

      <Column
        title="In Progress"
        tickets={inProgressTickets}
        onDelete={onDelete}
        deletingTicketId={deletingTicketId}
      />

      <Column
        title="Done"
        tickets={doneTickets}
        onDelete={onDelete}
        deletingTicketId={deletingTicketId}
      />

      {uncategorizedTickets.length > 0 && (
        <Column
          title="Uncategorized"
          tickets={uncategorizedTickets}
          onDelete={onDelete}
          deletingTicketId={deletingTicketId}
        />
      )}
    </div>
  );
}

export default Board;