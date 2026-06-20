function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

export function getPathDistanceKm(path: { lat: number; lng: number }[]) {
  if (path.length < 2) return "0.00";

  let totalDistance = 0;

  for (let i = 0; i < path.length - 1; i++) {
    const start = path[i];
    const end = path[i + 1];
    const earthRadiusKm = 6371;
    const dLat = toRadians(end.lat - start.lat);
    const dLng = toRadians(end.lng - start.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(start.lat)) *
        Math.cos(toRadians(end.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    totalDistance += earthRadiusKm * c;
  }

  return totalDistance.toFixed(2);
}

type LatLngInstance = object;

type MapsCoreLibrary = {
  LatLng: new (lat: number, lng: number) => LatLngInstance;
};

type MapsGeometryLibrary = {
  spherical: {
    computeDistanceBetween: (from: LatLngInstance, to: LatLngInstance) => number;
  };
};

export const calculateDistance = (
  path: { lat: number; lng: number }[],
  coreLibrary: MapsCoreLibrary,
  geometryLibrary: MapsGeometryLibrary,
) => {
  if (path.length < 2) return 0;
  let totalDistance = 0;

  for (let i = 0; i < path.length - 1; i++) {
    const start = new coreLibrary.LatLng(path[i].lat, path[i].lng);
    const end = new coreLibrary.LatLng(path[i + 1].lat, path[i + 1].lng);
    totalDistance += geometryLibrary.spherical.computeDistanceBetween(start, end);
  }

  return (totalDistance / 1000).toFixed(2);
};