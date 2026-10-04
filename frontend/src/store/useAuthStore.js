import { create } from "zustand";
import toast from "react-hot-toast";
import { axios } from "../lib/axios";
import { io } from "socket.io-client";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  socket: null,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await axios.get("/auth/check");
      set({ authUser: res.data });
      get.conn;
    } catch (error) {}
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axios.post("/auth/signup", data);
      set({ authUser: res.data });

      toast.success("Account created Successfully!");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axios.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged In successfully!!");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async () => {
    try {
      const res = await axios.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out Successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error("error in Logout");
      console.log("logout error".error);
    }
  },

  updateProfile: async () => {
    try {
      const res = await axios.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile pic Updated successFully !!!");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      withCredentials: true,
    });
    socket.connect();
    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket.connected) get().socket.disconnect();
  },
}));
