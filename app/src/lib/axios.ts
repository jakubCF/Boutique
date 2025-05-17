import axios from "axios"

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_HOST || "http://localhost:3000", // or adjust accordingly
})

export default instance