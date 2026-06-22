import {
  DateRange,
  FilterPayload,
  HistoryData,
  Stoppage,
} from "@/interfaces/interface";
import axios from "axios";

const toDate = (date: string, time: string) => new Date(`${date}T${time}:00`);

export function validateFilters(
  filters: Omit<FilterPayload, "regNumber"> & { regNumber: string },
): string | null {
  const { regNumber, startDate, endDate, startTime, endTime } = filters;

  if (!regNumber) return "Please select a registration number.";
  if (!startDate) return "Start date is required.";
  if (!endDate) return "End date is required.";
  if (!startTime) return "Start time is required.";
  if (!endTime) return "End time is required.";

  const start = toDate(startDate, startTime);
  const end = toDate(endDate, endTime);

  if (isNaN(start.getTime())) return "Invalid start date/time.";
  if (isNaN(end.getTime())) return "Invalid end date/time.";
  if (end <= start) return "End date/time must be after start date/time.";

  const diffMs = end.getTime() - start.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  if (diffDays > 7) return "Date range cannot exceed 7 days.";

  return null;
}

export const getTodayString = () => new Date().toISOString().split("T")[0];

export function toISTDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // Format as DD-MM-YYYY HH:mm:ss
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

export function segmentTrackingData(trackingHistoryData: any) {
  const segments = [];
  const currentSegment: any[] = [];

  for (const data of trackingHistoryData.data) {
    currentSegment.push(data);
  }

  if (currentSegment.length > 0) {
    segments.push(currentSegment);
  }

  return segments;
}

const STOPPAGE_MIN_IDLE_MS = 5 * 60 * 1000;

export function detectStoppages(points: HistoryData[]): Stoppage[] {
  if (points.length === 0) return [];

  const sorted = [...points].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  const stoppages: Stoppage[] = [];
  let idleStart: HistoryData | null = null;
  let lastOffTimestamp: string | null = null;

  const finalizeIdlePeriod = (endTimestamp: string) => {
    if (!idleStart) return;

    const startMs = new Date(idleStart.timestamp).getTime();
    const endMs = new Date(endTimestamp).getTime();
    const durationMs = endMs - startMs;

    if (durationMs > STOPPAGE_MIN_IDLE_MS) {
      stoppages.push({
        id: stoppages.length + 1,
        lat: Number(idleStart.latitude),
        lng: Number(idleStart.longitude),
        heading: Number(idleStart.heading) || 0,
        startTime: idleStart.timestamp,
        endTime: endTimestamp,
        durationMs,
      });
    }

    idleStart = null;
    lastOffTimestamp = null;
  };

  for (const point of sorted) {
    const isOff = point.eventData_ignitionStatus?.toUpperCase() === "OFF";

    if (isOff) {
      if (!idleStart) {
        idleStart = point;
      }
      lastOffTimestamp = point.timestamp;
      continue;
    }

    if (idleStart) {
      finalizeIdlePeriod(point.timestamp);
    }
  }

  if (idleStart && lastOffTimestamp) {
    finalizeIdlePeriod(lastOffTimestamp);
  }

  return stoppages;
}

export const fetchTrackingHistory = async (
  truckId: string,
  range?: DateRange,
) => {
  const simulatorUrl = process.env.NEXT_PUBLIC_SIMULATOR_URL;
 
  if (simulatorUrl && range?.from && range?.to) {
    try {
      const simulatorResponse = await axios.get(
        `${simulatorUrl}/api/tracking-history?truckId=${truckId}&dateFrom=${toISTDate(range.from)}&dateTo=${toISTDate(range.to)}`,
      );
      const simulatorData = simulatorResponse.data;
      console.log(simulatorData);
      return {
        data: segmentTrackingData(simulatorData),
        length: simulatorData.data.length,
      };
    } catch (simulatorError) {
      // Fall through to error handling below
      console.error("Error fetching tracking history from simulator:", simulatorError);
      return { error: "Failed to fetch tracking history from simulator." };
    }
  }
};
