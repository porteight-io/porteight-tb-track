import { HistoryData } from "@/interfaces/interface";

export type PlaybackRandomOffsets = {
  distanceKm: number;
  maxSpeed: number;
  avgSpeed: number;
};

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function createPlaybackRandomOffsets(): PlaybackRandomOffsets {
  return {
    distanceKm: randomInRange(1, 6),
    maxSpeed: randomInRange(2, 10),
    avgSpeed: randomInRange(2, 10),
  };
}

export function parseSpeedKmph(speed?: string): number {
  if (!speed) return 0;

  const value = Number(String(speed).replace(/[^\d.]/g, ""));
  if (Number.isNaN(value)) return 0;

  return Math.max(value, 0);
}

export function getPlaybackIndex(progress: number, pointCount: number) {
  if (pointCount <= 1) return 0;
  return Math.min(
    pointCount - 1,
    Math.max(0, Math.round((progress / 100) * (pointCount - 1))),
  );
}

export function getPlaybackStats(
  points: HistoryData[],
  progress: number,
  offsets: PlaybackRandomOffsets,
) {
  if (points.length === 0) {
    return {
      avgSpeed: 0,
      maxSpeed: 0,
      timestamp: "",
    };
  }

  const index = getPlaybackIndex(progress, points.length);
  const speeds = points.map((point) => parseSpeedKmph(point.speed));
  const maxSpeed = Math.max(...speeds) + offsets.maxSpeed;
  const avgSpeed =
    speeds.reduce((total, speed) => total + speed, 0) / speeds.length +
    offsets.avgSpeed;
  const timestamp = points[0]?.timestamp ?? "";

  return {
    avgSpeed,
    maxSpeed,
    timestamp,
  };
}

export function formatTimestamp(timestamp: string) {
  if (!timestamp) return "--";

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "--";

  return date.toLocaleString("en-GB");
}
