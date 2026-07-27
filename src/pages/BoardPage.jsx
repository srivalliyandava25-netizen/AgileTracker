import { Link } from 'react-router-dom'
import { useQuery } from "@tanstack/react-query";
import { getTickets } from "../services/ticketApi";
import Board from "../components/Borad";

function BoardPage() {
  const {
    data: tickets,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["tickets"],
    queryFn: getTickets,
  });

  if (isPending) {
    return <h2>Loading tickets...</h2>;
  }

  if (isError) {
    return <h2>Error: {error.message}</h2>;
  }

  return (
   <div className="page">
      <header className="board-header">
        <div>
          <h1>Agile Issue Tracker</h1>
          <p>Manage your team's work efficiently.</p>
        </div>

        <Link to="/tickets/new" className="create-ticket-btn">
          + Create New Ticket
        </Link>
      </header>

      <Board tickets={tickets} />
    </div>
  );
}

export default BoardPage;