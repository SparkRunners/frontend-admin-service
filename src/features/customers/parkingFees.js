export function haversineMeters(a, b) {
  const R = 6371000;
  const toRad = (x) => (x * Math.PI) / 180;

  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);

  const s1 = Math.sin(dLat / 2) * Math.sin(dLat / 2);
  const s2 =
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(s1 + s2), Math.sqrt(1 - (s1 + s2)));
  return R * c;
}

export function normalizePoint(pos) {
  if (!pos) return null;

  if (typeof pos.latitude === "number" && typeof pos.longitude === "number") {
    return { latitude: pos.latitude, longitude: pos.longitude };
  }

  if (
    pos.coordinates &&
    typeof pos.coordinates.latitude === "number" &&
    typeof pos.coordinates.longitude === "number"
  ) {
    return {
      latitude: pos.coordinates.latitude,
      longitude: pos.coordinates.longitude,
    };
  }

  return null;
}

export function isNearStations(point, stations, radiusMeters = 50) {
  if (!point || !Array.isArray(stations)) return false;

  for (const s of stations) {
    const p = normalizePoint(s?.coordinates ?? s);
    if (!p) continue;
    if (haversineMeters(point, p) <= radiusMeters) return true;
  }
  return false;
}

export function isInsideZoneCircle(point, zone) {
  if (!point || !zone) return false;

  const center = normalizePoint(zone?.center ?? zone?.coordinates ?? zone);
  const r =
    typeof zone?.radiusMeters === "number"
      ? zone.radiusMeters
      : typeof zone?.radius === "number"
      ? zone.radius
      : 80;

  if (!center) return false;
  return haversineMeters(point, center) <= r;
}

export function isInAcceptedParking(point, zones, stations) {
  const inStation = isNearStations(point, stations, 50);
  if (inStation) return { ok: true, type: "station" };

  if (Array.isArray(zones)) {
    for (const z of zones) {
      if (isInsideZoneCircle(point, z)) return { ok: true, type: "zone" };
    }
  }

  return { ok: false, type: "free" };
}

export function parseCost(value) {
  if (typeof value === "number") return value;
  if (!value) return 0;
  const num = Number(String(value).replace(",", ".").replace(/[^\d.]/g, ""));
  return Number.isFinite(num) ? num : 0;
}

export function computeParkingAdjustment(trip, zones, stations, pricing) {
  const start = normalizePoint(trip?.startPosition);
  const end = normalizePoint(trip?.endPosition);

  const startCheck = isInAcceptedParking(start, zones, stations);
  const endCheck = isInAcceptedParking(end, zones, stations);

  const isStartFree = !startCheck.ok;
  const isEndFree = !endCheck.ok;

  const freeParkingFee =
    typeof pricing?.freeParkingFee === "number" ? pricing.freeParkingFee : 10;

  const startFeeDiscountIfFromFreeToDefined =
    typeof pricing?.startFeeDiscountIfFromFreeToDefined === "number"
      ? pricing.startFeeDiscountIfFromFreeToDefined
      : 2;

  let adjustment = 0;
  let tags = [];

  if (isEndFree) {
    adjustment += freeParkingFee;
    tags.push(`Fri parkering +${freeParkingFee} kr`);
  } else {
    tags.push("Definierad parkering");
  }

  if (isStartFree && !isEndFree) {
    adjustment -= startFeeDiscountIfFromFreeToDefined;
    tags.push(`Startavgift rabatt -${startFeeDiscountIfFromFreeToDefined} kr`);
  }

  return {
    startType: startCheck.type,
    endType: endCheck.type,
    isStartFree,
    isEndFree,
    adjustment,
    tags,
  };
}
