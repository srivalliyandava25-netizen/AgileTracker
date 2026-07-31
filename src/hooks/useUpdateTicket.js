import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTicket } from "../services/ticketApi";

export function useUpdateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, updatedData }) =>
      updateTicket(ticketId, updatedData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tickets"],
      });
    },
  });
}