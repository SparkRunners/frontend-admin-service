import { useEffect, useMemo, useState } from "react";
import { connectSimulationSocket } from "./simulationSocket";

/**
 * Prefers live scooters from simulation socket when available,
 * otherwise falls back to the REST-provided scooters.
 */
export function useLiveScooters(fallbackScooters) {
  const [liveScooters, setLiveScooters] = useState([]);
  const [meta, setMeta] = useState({
    connected: false,
    lastUpdateIso: null,
    count: 0,
    error: "",
  });

  useEffect(() => {
    const disconnect = connectSimulationSocket({
      onConnect: () => setMeta((m) => ({ ...m, connected: true, error: "" })),
      onDisconnect: () => setMeta((m) => ({ ...m, connected: false })),
      onError: (err) =>
        setMeta((m) => ({ ...m, error: err?.message || "Socket error" })),
      onScooters: (list) => {
        const arr = Array.isArray(list) ? list : [];
        setLiveScooters(arr);
        setMeta((m) => ({
          ...m,
          connected: true,
          lastUpdateIso: new Date().toISOString(),
          count: arr.length,
        }));
      },
    });

    return () => disconnect?.();
  }, []);

  const scooters = useMemo(() => {
    const hasLive = Array.isArray(liveScooters) && liveScooters.length > 0;
    if (hasLive) return liveScooters;
    return Array.isArray(fallbackScooters) ? fallbackScooters : [];
  }, [liveScooters, fallbackScooters]);

  const lastUpdateText = useMemo(() => {
    if (!meta.lastUpdateIso) return "—";
    return new Date(meta.lastUpdateIso).toLocaleTimeString("sv-SE");
  }, [meta.lastUpdateIso]);

  return { scooters, liveScooters, meta, lastUpdateText };
}
