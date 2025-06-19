import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "/api"
    : "http://localhost:3001/api");

export default axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function confirmDisposal(token) {
  return await axios.post(
    "/api/prediction/disposal-confirmation",
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}
