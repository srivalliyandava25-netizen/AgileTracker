import Column from "./Column";

function Board({ tickets }) {
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
    (ticket) => !validStatuses.includes(ticket.status)
  );

  return (
    <div className="board">
      <Column
        title="To Do"
        tickets={todoTickets}
      />

      <Column
        title="In Progress"
        tickets={inProgressTickets}
      />

      <Column
        title="Done"
        tickets={doneTickets}
      />

      {uncategorizedTickets.length > 0 && (
        <Column
          title="Uncategorized"
          tickets={uncategorizedTickets}
        />
      )}
    </div>
  );
}

export default Board;