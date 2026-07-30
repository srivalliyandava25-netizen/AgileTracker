import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getTickets,
  deleteTicket,
} from "../services/ticketApi";

import Board from "../components/Board";

function BoardPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [prioritySort, setPrioritySort] = useState("none");
  const [dueDateFilter, setDueDateFilter] = useState("all");
  const [dueDateSort, setDueDateSort] = useState("none");
  const [deleteMessage, setDeleteMessage] = useState("");

  const queryClient = useQueryClient();

  const {
    data: tickets = [],
    isPending,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["tickets"],
    queryFn: getTickets,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTicket,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tickets"],
      });

      setDeleteMessage("Ticket deleted successfully.");

      setTimeout(() => {
        setDeleteMessage("");
      }, 3000);
    },
  });

  function handleDelete(ticketId) {
    setDeleteMessage("");
    deleteMutation.mutate(ticketId);
  }

  function clearSearch() {
    setSearch("");
  }

  function resetFilters() {
    setSearch("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setPrioritySort("none");
    setDueDateFilter("all");
    setDueDateSort("none");
  }

  if (isPending) {
    return (
      <div className="page">
        <h2>Loading tickets...</h2>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="page">
        <h2>Failed to load tickets</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  const filteredTickets = tickets.filter((ticket) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      ticket.title?.toLowerCase().includes(searchText) ||
      ticket.description
        ?.toLowerCase()
        .includes(searchText) ||
      ticket.assignee
        ?.toLowerCase()
        .includes(searchText);

    const matchesStatus =
      statusFilter === "all" ||
      ticket.status === statusFilter;

    const matchesPriority =
      priorityFilter === "all" ||
      ticket.priority === priorityFilter;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const ticketDueDate = ticket.dueDate
      ? new Date(ticket.dueDate)
      : null;

    if (ticketDueDate) {
      ticketDueDate.setHours(0, 0, 0, 0);
    }

    const matchesDueDate =
      dueDateFilter === "all" ||
      (dueDateFilter === "today" &&
        ticketDueDate &&
        ticketDueDate.getTime() ===
          today.getTime()) ||
      (dueDateFilter === "overdue" &&
        ticketDueDate &&
        ticketDueDate < today &&
        ticket.status !== "done");

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesDueDate
    );
  });

  const sortedTickets = [...filteredTickets].sort(
    (a, b) => {
      if (prioritySort === "high") {
        const priorityOrder = {
          high: 1,
          medium: 2,
          low: 3,
        };

        return (
          (priorityOrder[a.priority] || 99) -
          (priorityOrder[b.priority] || 99)
        );
      }

      if (prioritySort === "low") {
        const priorityOrder = {
          high: 1,
          medium: 2,
          low: 3,
        };

        return (
          (priorityOrder[b.priority] || 99) -
          (priorityOrder[a.priority] || 99)
        );
      }

      if (dueDateSort === "earliest") {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;

        return (
          new Date(a.dueDate) -
          new Date(b.dueDate)
        );
      }

      if (dueDateSort === "latest") {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;

        return (
          new Date(b.dueDate) -
          new Date(a.dueDate)
        );
      }

      return 0;
    }
  );

  return (
    <div className="page">
      <header className="board-header">
        <div>
          <h1>Agile Issue Tracker</h1>

          <p>
            Manage your team's work efficiently.
          </p>
        </div>

        <Link
          to="/tickets/new"
          className="create-ticket-btn"
        >
          + Create New Ticket
        </Link>
      </header>

      {deleteMessage && (
        <div className="success-message">
          {deleteMessage}
        </div>
      )}

      {deleteMutation.isError && (
        <div className="error">
          Failed to delete ticket:{" "}
          {deleteMutation.error.message}
        </div>
      )}

      <div className="search-container">
        <input
          type="text"
          placeholder="Search tickets..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

        {search && (
          <button
            type="button"
            onClick={clearSearch}
          >
            Clear
          </button>
        )}
      </div>

      <div className="filters">
        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
        >
          <option value="all">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in-progress">
            In Progress
          </option>
          <option value="done">Done</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(event) =>
            setPriorityFilter(event.target.value)
          }
        >
          <option value="all">
            All Priorities
          </option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select
          value={dueDateFilter}
          onChange={(event) =>
            setDueDateFilter(event.target.value)
          }
        >
          <option value="all">
            All Due Dates
          </option>
          <option value="today">
            Due Today
          </option>
          <option value="overdue">
            Overdue
          </option>
        </select>

        <select
          value={prioritySort}
          onChange={(event) =>
            setPrioritySort(event.target.value)
          }
        >
          <option value="none">
            Default Priority
          </option>
          <option value="high">
            High Priority First
          </option>
          <option value="low">
            Low Priority First
          </option>
        </select>

        <select
          value={dueDateSort}
          onChange={(event) =>
            setDueDateSort(event.target.value)
          }
        >
          <option value="none">
            Default Due Date
          </option>
          <option value="earliest">
            Earliest Due Date
          </option>
          <option value="latest">
            Latest Due Date
          </option>
        </select>

        <button
          type="button"
          onClick={resetFilters}
        >
          Reset Filters
        </button>
      </div>

      {isFetching && (
        <p>Refreshing tickets...</p>
      )}

      <div className="ticket-count">
        Showing {sortedTickets.length} of{" "}
        {tickets.length} tickets
      </div>

      {sortedTickets.length === 0 ? (
        <div className="empty-state">
          <h2>No tickets found</h2>

          <p>
            No tickets match your current search or
            filters.
          </p>

          <button
            type="button"
            onClick={resetFilters}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <Board
          tickets={sortedTickets}
          onDelete={handleDelete}
          deletingTicketId={
            deleteMutation.isPending
              ? deleteMutation.variables
              : null
          }
        />
      )}
    </div>
  );
}

export default BoardPage;