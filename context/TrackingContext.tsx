"use client";

import {
  createContext,
  useState,
  ReactNode,
} from "react";
import { HistoryData, Stoppage } from "@/interfaces/interface";

type TrackPoint = {
  lat: number;
  lng: number;
};

type TruckProp = {
  truck_no: string;
  eventStatus: string;
  lat?: number;
  lng?: number;
  model?: string;
};

type TrackingContextType = {
  trackPath: TrackPoint[];
  historyData: HistoryData[];
  stoppages: Stoppage[];
  truckData: TruckProp;
  setTruckData: React.Dispatch<React.SetStateAction<TruckProp>>;
  setTrackPath: React.Dispatch<React.SetStateAction<TrackPoint[]>>;
  setHistoryData: React.Dispatch<React.SetStateAction<HistoryData[]>>;
  setStoppages: React.Dispatch<React.SetStateAction<Stoppage[]>>;
};

export const TrackingContext = createContext<TrackingContextType | undefined>(
  undefined
);

export function TrackingProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [trackPath, setTrackPath] = useState<TrackPoint[]>([]);
  const [historyData, setHistoryData] = useState<HistoryData[]>([]);
  const [stoppages, setStoppages] = useState<Stoppage[]>([]);
  const [truckData, setTruckData] = useState<TruckProp>({
    truck_no: "",
    eventStatus: "",
    lat: undefined,
    lng: undefined,
    model: "",
    // reporting_time: "",
    // current_location: ""
  });

  return (
    <TrackingContext.Provider
      value={{
        trackPath,
        setTrackPath,
        historyData,
        setHistoryData,
        stoppages,
        setStoppages,
        truckData,
        setTruckData,
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
}