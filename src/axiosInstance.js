import axios from "axios";

const API_URL = "http://localhost:5001";

export const axiosInstance = axios.create({
    baseURL: API_URL,
});
