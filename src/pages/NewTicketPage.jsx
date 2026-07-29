import { Form, Link } from "react-router-dom";

function NewTicketPage() {
  return (
    <div className="new-ticket-page">
      <h1>Create New Ticket</h1>

      <Form method="post">
        <label>Title</label>
        <input
          type="text"
          name="title"
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          required
        />

        <label>Status</label>
        <select name="status" defaultValue="todo">
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <label>Priority</label>
        <select name="priority" defaultValue="medium">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <label>Assignee</label>
        <input
          type="text"
          name="assignee"
          required
        />

        <div className="form-buttons">
          <button type="submit">
            Create Ticket
          </button>

          <Link to="/">Cancel</Link>
        </div>
      </Form>
    </div>
  );
}

export default NewTicketPage;