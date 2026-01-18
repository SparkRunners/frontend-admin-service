import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL;

export function connectSimulationSocket({
  onScooters,
  onUsers,
  onConnect,
  onDisconnect,
  onError,
} = {}) {
  const socket = io(API_URL, { transports: ["websocket"] });

  socket.on("connect", () => onConnect?.(socket.id));
  socket.on("disconnect", (reason) => onDisconnect?.(reason));
  socket.on("connect_error", (err) => onError?.(err));

  socket.on("scooters:init", (scooters) => {
    onScooters?.(Array.isArray(scooters) ? scooters : []);
  });

  socket.on("users:init", (users) => {
    onUsers?.(Array.isArray(users) ? users : []);
  });

  return () => {
    socket.off("scooters:init");
    socket.off("users:init");
    socket.disconnect();
  };
}
