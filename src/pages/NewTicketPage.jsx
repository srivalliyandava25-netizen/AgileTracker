import {
  Form,
  Link,
  useActionData,
  useNavigation,
} from "react-router-dom";

function NewTicketPage() {
  const navigation = useNavigation();
  const actionData = useActionData();

  const isSubmitting =
    navigation.state === "submitting";

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-xl bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Navigation Link */}
        <Link
          to="/"
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          ← Back to Board
        </Link>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Create New Ticket
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Create a new issue and add it to your board.
          </p>
        </div>

        {/* Error Alert */}
        {actionData?.error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium shadow-sm">
            {actionData.error}
          </div>
        )}

        {/* Form */}
        <Form
          method="post"
          className="space-y-4"
        >
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Title
            </label>
            <input
              id="title"
              type="text"
              name="title"
              placeholder="Enter ticket title"
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Describe the issue"
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 resize-none"
            />
          </div>

          {/* Status & Priority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="status" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Status
              </label>
              <select
                id="status"
                name="status"
                defaultValue="todo"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="priority" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                defaultValue="medium"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Due Date & Assignee Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="dueDate" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Due Date
              </label>
              <input
                id="dueDate"
                type="date"
                name="duedate"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="assignee" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Assignee
              </label>
              <input
                id="assignee"
                type="text"
                name="assignee"
                placeholder="Enter assignee name"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <Link
              to="/"
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              {isSubmitting
                ? "Creating..."
                : "Create Ticket"}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default NewTicketPage;