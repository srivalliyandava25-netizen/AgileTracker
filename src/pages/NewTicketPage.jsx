import { Form, Link } from "react-router-dom"

function NewTicketPage() {
  return (
    <div className="new-ticket-page">
      <h1>Create New Ticket</h1>

      <Form method="post">

        <label>Title:</label>

        <input
        type="text"
        name="title"
        required />
        <br/>
        
        <label>Descripiton:</label>
        <textarea
        name="description"
        required />

        <label>Priority</label>

        <select
        name="priority"
        defaultValue="todo" >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <label>Assignee</label>
        <input
        type="text"
        name="assignee"
        required />

        <div className="form-buttons">

          <button type="submit">
            create Ticket
          </button>

          <Link to="/">Cancel</Link>
        </div>
      </Form>
    </div>
  );
}

export default NewTicketPage;