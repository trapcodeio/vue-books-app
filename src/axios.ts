import axios from "axios";

const serverUrl = import.meta.env.VITE_API_URL as string | undefined;

if (!serverUrl) {
  throw new Error("Please define the VITE_API_URL environment variable.");
}

export const $axios = axios.create({
  baseURL: serverUrl
});

if (import.meta.env.DEV) console.log(`API_URL:`, serverUrl);
