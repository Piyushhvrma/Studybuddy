import axios from "axios";


const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

// Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("StudyBuddy_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
// Rooms
export const createRoom = (data) => API.post("/room/create", data);

export const joinRoom = (data) => API.post("/room/join", data);

export const getRoomByCode = (roomCode) => API.get(`/room/${roomCode}`);

// User
export const getProfile = () => API.get("/user/profile");
export const updateProfile = (data) => API.put("/user/profile", data);

// Tracker
export const createEntry = (data) => API.post("/tracker/create", data);
export const updateEntry = (id, data) => API.put(`/tracker/update/${id}`, data);
export const deleteEntry = (id) => API.delete(`/tracker/delete/${id}`);
export const getAllEntries = () => API.get("/tracker/getall");

// Folders
export const createFolder = (data) => API.post("/folder/create", data);
export const updateFolder = (id, data) => API.put(`/folder/update/${id}`, data);
export const deleteFolder = (id) => API.delete(`/folder/delete/${id}`);
export const getAllFolders = () => API.get("/folder/getall");

// Notes
export const createNote = (data) => API.post("/note/create", data);
export const updateNote = (id, data) => API.put(`/note/update/${id}`, data);
export const deleteNote = (id) => API.delete(`/note/delete/${id}`);
export const getAllNotes = (folderId) =>
  API.get(`/note/getall${folderId ? `?folderId=${folderId}` : ""}`);

// Materials
export const uploadMaterial = (data) =>
  API.post("/material/upload", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteMaterial = (id) => API.delete(`/material/delete/${id}`);
export const getAllMaterials = () => API.get("/material/getall");

// AI
export const sendMessage = (data) => API.post("/ai/chat", data);
export const getChatHistory = () => API.get("/ai/history");
export const clearChatHistory = () => API.delete("/ai/history");

// Analytics
export const getAnalyticsOverview = () => API.get("/analytics/overview");

export default API;
