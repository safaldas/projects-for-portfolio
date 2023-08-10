import axios from "axios";

// Create an Axios instance with global defaults
const axiosInstance = axios.create({
  baseURL: "http://localhost:3333", // Replace with your API domain
  withCredentials: true, // Include cookies in requests
  // Other global configuration options...
});

export default axiosInstance;
