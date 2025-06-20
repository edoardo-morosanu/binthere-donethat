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
