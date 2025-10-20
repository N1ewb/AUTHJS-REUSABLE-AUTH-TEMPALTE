import axios from "axios";

const getBaseURL = () => {
  if (process.env.NODE_ENV !== "production") {
    const url = "http://localhost:3000/api";
    return url;
  } else {
    const url = "https://ipomemotracker.vercel.app/api";
    return url;
  }
};
const baseURL = getBaseURL();
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
