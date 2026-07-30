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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
          <h2 className="text-lg font-semibold text-slate-600">Loading tickets...</h2>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-rose-200 rounded-2xl p-6 shadow-xl text-center">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl border border-rose-200">
            !
          </div>
          <h2 className="text-lg font-bold text-slate-800 mb-1">Failed to load tickets</h2>
          <p className="text-sm text-slate-500 mb-4">{error.message}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // DASHBOARD STATISTICS
  // =========================

  const totalTickets = tickets.length;

  const todoTickets = tickets.filter(
    (ticket) => ticket.status === "todo"
  ).length;

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "in-progress"
  ).length;

  const completedTickets = tickets.filter(
    (ticket) => ticket.status === "done"
  ).length;

  // =========================
  // FILTERING
  // =========================

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

    const ticketDueDate = ticket.duedate
      ? new Date(ticket.duedate)
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

  // =========================
  // SORTING
  // =========================

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
        if (!a.duedate) return 1;
        if (!b.duedate) return -1;

        return (
          new Date(a.duedate) -
          new Date(b.duedate)
        );
      }

      if (dueDateSort === "latest") {
        if (!a.duedate) return 1;
        if (!b.duedate) return -1;

        return (
          new Date(b.duedate) -
          new Date(a.duedate)
        );
      }

      return 0;
    }
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">

        {/* HEADER */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Agile Issue Tracker
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage your team's work efficiently.
            </p>
          </div>

          <Link
            to="/tickets/new"
            className="inline-flex items-center justify-center px-4 py-2.5 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
          >
            + Create New Ticket
          </Link>
        </header>

        {/* DASHBOARD STATS */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Dashboard</h2>
            <p className="text-xs text-slate-500">
              Overview of your team's tickets
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center text-lg shrink-0">
                📋
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Tickets</h3>
                <p className="text-xl font-bold text-slate-900 mt-0.5">{totalTickets}</p>
              </div>
            </div>

            {/* To Do */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center text-lg shrink-0">
                📝
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">To Do</h3>
                <p className="text-xl font-bold text-slate-900 mt-0.5">{todoTickets}</p>
              </div>
            </div>

            {/* In Progress */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center text-lg shrink-0">
                🔄
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">In Progress</h3>
                <p className="text-xl font-bold text-slate-900 mt-0.5">{inProgressTickets}</p>
              </div>
            </div>

            {/* Completed */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center text-lg shrink-0">
                ✅
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed</h3>
                <p className="text-xl font-bold text-slate-900 mt-0.5">{completedTickets}</p>
              </div>
            </div>
          </div>
        </section>

        {/* TOAST MESSAGES */}
        {deleteMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-medium shadow-sm flex items-center gap-2">
            <span>✓</span> {deleteMessage}
          </div>
        )}

        {deleteMutation.isError && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm font-medium shadow-sm">
            Failed to delete ticket: {deleteMutation.error.message}
          </div>
        )}

        {/* SEARCH & FILTERS TOOLBAR */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search tickets by title, description, or assignee..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="w-full pl-4 pr-20 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-200/80 hover:bg-slate-300 rounded-lg transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(event.target.value)
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <select
              value={dueDateFilter}
              onChange={(event) =>
                setDueDateFilter(event.target.value)
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 cursor-pointer"
            >
              <option value="all">All Due Dates</option>
              <option value="today">Due Today</option>
              <option value="overdue">Overdue</option>
            </select>

            <select
              value={prioritySort}
              onChange={(event) =>
                setPrioritySort(event.target.value)
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 cursor-pointer"
            >
              <option value="none">Default Priority</option>
              <option value="high">High Priority First</option>
              <option value="low">Low Priority First</option>
            </select>

            <select
              value={dueDateSort}
              onChange={(event) =>
                setDueDateSort(event.target.value)
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 cursor-pointer"
            >
              <option value="none">Default Due Date</option>
              <option value="earliest">Earliest Due Date</option>
              <option value="latest">Latest Due Date</option>
            </select>

            <button
              type="button"
              onClick={resetFilters}
              className="w-full px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* STATUS COUNT */}
        <div className="flex items-center justify-between text-xs font-medium text-slate-500 px-1">
          <span>
            Showing <strong className="text-slate-800">{sortedTickets.length}</strong> of{" "}
            <strong className="text-slate-800">{tickets.length}</strong> tickets
          </span>

          {isFetching && (
            <span className="inline-flex items-center gap-1.5 text-sky-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-sky-600 animate-pulse" />
              Refreshing...
            </span>
          )}
        </div>

        {/* BOARD OR EMPTY STATE */}
        {sortedTickets.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm max-w-lg mx-auto my-8">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 border border-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
              🔍
            </div>
            <h2 className="text-lg font-bold text-slate-800 mb-1">No tickets found</h2>
            <p className="text-xs text-slate-500 mb-6">
              No tickets match your current search or filters.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-xl text-xs font-semibold transition-colors"
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
    </div>
  );
}

export default BoardPage;