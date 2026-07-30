import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTicket } from "../services/ticketApi";

export function useDeleteTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ticketId) => deleteTicket(ticketId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tickets"],
      });
    },

    onError: (error) => {
      console.error("Delete ticket failed:", error);
    },
  });
}