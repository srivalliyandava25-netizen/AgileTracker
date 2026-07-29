import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTicket } from "../services/ticketApi";

export function useUpdateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, updatedData }) =>
      updateTicket(ticketId, updatedData),

    onMutate: async ({ ticketId, updatedData }) => {
      await queryClient.cancelQueries({
        queryKey: ["tickets"],
      });

      const previousTickets = queryClient.getQueryData(["tickets"]);

      queryClient.setQueryData(["tickets"], (oldTickets) => {
        return oldTickets.map((ticket) =>
          ticket.id === ticketId
            ? { ...ticket, ...updatedData }
            : ticket
        );
      });

      return { previousTickets };
    },

    onError: (error, variables, context) => {
      queryClient.setQueryData(
        ["tickets"],
        context.previousTickets
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["tickets"],
      });
    },
  });
}