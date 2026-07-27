import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import BoardPage from "../pages/BoardPage";
import NewTicketPage from "../pages/NewTicketPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <BoardPage />,
  },
  {
    path: "/tickets/new",
    element: <NewTicketPage />,
  },
]);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;