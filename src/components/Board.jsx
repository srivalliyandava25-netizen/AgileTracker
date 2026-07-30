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
    (ticket) => !validStatuses.includes(ticket.status)
  );

  return (
    <div className="w-full text-slate-800">
      {/* Board Columns Flex Layout - Cleaned Tailwind Shorthands */}
      <div className="flex flex-col lg:flex-row gap-6 items-start overflow-x-auto pb-6 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="w-full lg:min-w-85 xl:min-w-95 lg:flex-1">
          <Column
            title="To Do"
            tickets={todoTickets}
            onDelete={onDelete}
            deletingTicketId={deletingTicketId}
            accentColor="border-amber-500"
            badgeBg="bg-amber-100 text-amber-800 border-amber-200"
          />
        </div>

        <div className="w-full lg:min-w-85 xl:min-w-95 lg:flex-1">
          <Column
            title="In Progress"
            tickets={inProgressTickets}
            onDelete={onDelete}
            deletingTicketId={deletingTicketId}
            accentColor="border-sky-500"
            badgeBg="bg-sky-100 text-sky-800 border-sky-200"
          />
        </div>

        <div className="w-full lg:min-w-85 xl:min-w-95 lg:flex-1">
          <Column
            title="Done"
            tickets={doneTickets}
            onDelete={onDelete}
            deletingTicketId={deletingTicketId}
            accentColor="border-emerald-500"
            badgeBg="bg-emerald-100 text-emerald-800 border-emerald-200"
          />
        </div>

        {uncategorizedTickets.length > 0 && (
          <div className="w-full lg:min-w-85 xl:min-w-95 lg:flex-1">
            <Column
              title="Uncategorized"
              tickets={uncategorizedTickets}
              onDelete={onDelete}
              deletingTicketId={deletingTicketId}
              accentColor="border-purple-500"
              badgeBg="bg-purple-100 text-purple-800 border-purple-200"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Board;