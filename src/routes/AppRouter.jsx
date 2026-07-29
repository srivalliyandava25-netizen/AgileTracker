import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";

import BoardPage from "../pages/BoardPage";
import NewTicketPage from "../pages/NewTicketPage";

import { ticketLoader } from "../loaders/ticketLoader";
import { createTicket } from "../services/ticketApi";
import { queryClient } from "../services/queryClient";

async function createTicketAction({ request }) {
  const formData = await request.formData();

  // Debug logs
  console.log("Status:", formData.get("status"));
  console.log("Priority:", formData.get("priority"));

  const ticketData = {
    title: formData.get("title"),
    description: formData.get("description"),
    priority: formData.get("priority"),
    assignee: formData.get("assignee"),
    status: formData.get("status"),
  };

  console.log("Ticket Data:", ticketData);

  await createTicket(ticketData);

  await queryClient.invalidateQueries({
    queryKey: ["tickets"],
  });

  return redirect("/");
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <BoardPage />,
    loader: ticketLoader,
    HydrateFallback: () => <h2>Loading...</h2>,
  },
  {
    path: "/tickets/new",
    element: <NewTicketPage />,
    action: createTicketAction,
  },
]);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;