import axios from "axios";

const baseURL =
  process.env.NEXTAUTH_URL ||
  (process.env.NODE_ENV !== "production"
    ? "http://localhost:3000/api"
    : "/api");

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

// api.interceptors.request.use(async (config) => {
//   const session = await auth();
//   if (session) {
//     config.headers["Authorization"] = `Bearer ${session.user.api_token}`;
//   }

//   config.headers["ngrok-skip-browser-warning"] = "true";
//   return config;
// });

export default api;
