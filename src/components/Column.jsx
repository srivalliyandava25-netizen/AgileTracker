import Ticket from "./Ticket";

function Column({
  title,
  tickets = [],
  onDelete,
  deletingTicketId,
  accentColor = "border-slate-300",
  badgeBg = "bg-slate-100 text-slate-700 border-slate-200",
}) {
  // Map title to indicator dot colors
  const getDotColor = (columnTitle) => {
    switch (columnTitle.toLowerCase()) {
      case "to do":
        return "bg-amber-500 shadow-amber-500/30";
      case "in progress":
        return "bg-sky-500 shadow-sky-500/30";
      case "done":
        return "bg-emerald-500 shadow-emerald-500/30";
      default:
        return "bg-purple-500 shadow-purple-500/30";
    }
  };

  return (
    <div className="w-full min-w-80 xl:min-w-90 flex-1 bg-slate-100/80 border border-slate-200/80 rounded-2xl p-5 lg:p-6 flex flex-col gap-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <span
            className={`h-3 w-3 rounded-full shadow-sm ${getDotColor(
              title
            )}`}
          />
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">
            {title}
          </h2>
        </div>

        {/* Count Badge */}
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full border ${badgeBg}`}
        >
          {tickets.length}
        </span>
      </div>

      {/* Content Area - Canonical Classes Used */}
      <div className="flex flex-col gap-4 grow overflow-y-auto max-h-[calc(100vh-250px)] scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {tickets.length === 0 ? (
          <div className="grow flex flex-col items-center justify-center p-8 border border-dashed border-slate-300 rounded-xl bg-white/50 text-center my-auto min-h-40">
            <span className="text-2xl mb-2 opacity-40">✨</span>
            <p className="text-slate-400 text-sm font-medium">
              No tickets in this column
            </p>
          </div>
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