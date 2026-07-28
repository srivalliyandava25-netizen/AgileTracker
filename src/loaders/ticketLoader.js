import { queryClient } from "../services/queryClient";
import { getTickets } from "../services/ticketApi";

export async function ticketLoader() {
  return queryClient.ensureQueryData({
    queryKey: ["tickets"],
    queryFn: getTickets,
  });
}