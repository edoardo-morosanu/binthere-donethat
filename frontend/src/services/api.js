import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "/api"
    : "http://localhost:3001/api");

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;

export async function confirmDisposal(token) {
  return await apiClient.post(
    "/prediction/disposal-confirmation",
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}

export async function submitContactForm(contactData) {
  return await apiClient.post("/contact/submit", contactData);
}

// Admin functions for contact message management
export async function getAllContactMessages(params = {}) {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append("page", params.page);
  if (params.limit) queryParams.append("limit", params.limit);
  if (params.isAccepted !== undefined)
    queryParams.append("isAccepted", params.isAccepted);

  const queryString = queryParams.toString();
  const url = `/contact/messages${queryString ? `?${queryString}` : ""}`;

  return await apiClient.get(url);
}

export async function updateContactMessageStatus(messageId, isAccepted) {
  return await apiClient.patch(`/contact/messages/${messageId}/accept`, {
    isAccepted,
  });
}
