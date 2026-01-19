import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL;

export function connectSimulationSocket({
  onScooters,
  onUsers,
  onConnect,
  onDisconnect,
  onError,
} = {}) {
  const socket = io(API_URL, {
    path: "/socket.io",
    transports: ["polling", "websocket"],
    withCredentials: false,
    timeout: 20000,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 500,
  });

  socket.on("connect", () => onConnect?.(socket.id));
  socket.on("disconnect", (reason) => onDisconnect?.(reason));
  socket.on("connect_error", (err) => onError?.(err));

  socket.on("scooters:init", (scooters) => {
    onScooters?.(Array.isArray(scooters) ? scooters : []);
  });

  socket.on("scooters:init", (scooters) => {
  onScooters?.(Array.isArray(scooters) ? scooters : []);
  });

  socket.on("scooters:update", (scooters) => {
    onScooters?.(Array.isArray(scooters) ? scooters : []);
  });

  socket.on("scooters:tick", (scooters) => {
    onScooters?.(Array.isArray(scooters) ? scooters : []);
  });


  socket.on("users:init", (users) => {
    onUsers?.(Array.isArray(users) ? users : []);
  });


  return () => {
    socket.off("scooters:init");
    socket.off("users:init");
    socket.disconnect();
    socket.off("scooters:update");
  socket.off("scooters:tick");
  };
}
