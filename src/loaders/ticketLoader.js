import { getTicket } from "../services/ticketApi";

export async function ticktetLoader() {
    const tickets = await getTicket();

    return tickets;
}