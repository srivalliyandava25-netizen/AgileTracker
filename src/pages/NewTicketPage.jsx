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
    <div className="new-ticket-page">
      <div className="new-ticket-container">
        <Link
          to="/"
          className="new-ticket-back"
        >
          ← Back to Board
        </Link>

        <div className="new-ticket-header">
          <h1>Create New Ticket</h1>
          <p>
            Create a new issue and add it to your
            board.
          </p>
        </div>

        {actionData?.error && (
          <p className="new-ticket-error">
            {actionData.error}
          </p>
        )}

        <Form
          method="post"
          className="new-ticket-form"
        >
          <label htmlFor="title">
            Title
          </label>

          <input
            id="title"
            type="text"
            name="title"
            placeholder="Enter ticket title"
            required
          />

          <label htmlFor="description">
            Description
          </label>

          <textarea
            id="description"
            name="description"
            placeholder="Describe the issue"
            required
          />

          <label htmlFor="status">
            Status
          </label>

          <select
            id="status"
            name="status"
            defaultValue="todo"
          >
            <option value="todo">
              To Do
            </option>

            <option value="in-progress">
              In Progress
            </option>

            <option value="done">
              Done
            </option>
          </select>

          <label htmlFor="priority">
            Priority
          </label>

          <select
            id="priority"
            name="priority"
            defaultValue="medium"
          >
            <option value="low">
              Low
            </option>

            <option value="medium">
              Medium
            </option>

            <option value="high">
              High
            </option>
          </select>

          <label htmlFor="dueDate">
            Due Date
          </label>

          <input
            id="dueDate"
            type="date"
            name="dueDate"
            required
          />

          <label htmlFor="assignee">
            Assignee
          </label>

          <input
            id="assignee"
            type="text"
            name="assignee"
            placeholder="Enter assignee name"
            required
          />

          <div className="form-buttons">
            <button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Creating..."
                : "Create Ticket"}
            </button>

            <Link to="/">
              Cancel
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default NewTicketPage;