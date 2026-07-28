const API_URL = "http://localhost:3001/tickets";

export async function getTickets() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch tickets");
  }

  return response.json();
}

export async function createTicket(ticketData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ticketData),
  });

  if (!response.ok) {
    throw new Error("Failed to create ticket");
  }

  return response.json();
}

export async function updateTicket(
  ticketId,
  updatedData
) {
  const response = await fetch(
    `${API_URL}/${ticketId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update ticket");
  }

  return response.json();
}