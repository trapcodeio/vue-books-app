import axios from "axios";

const serverUrl = import.meta.env.VITE_API_URL;

export const $axios = axios.create({
  baseURL: serverUrl
});

console.log(serverUrl);
