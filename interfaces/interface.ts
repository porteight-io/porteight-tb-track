import { Metadata } from "next";
import { ReactNode } from "react";

export interface ButtonProps {
  variant: "primary" | "secondary" | "tertiary";
  text: string;
  size: "sm" | "md" | "lg";
  frontIcon?: ReactNode;
  backIcon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export interface VehicleNumber {
  registrationNo: string;
  model: string;
}

export interface InputProps {
  value: string;
  setValue: (value: string) => void;
  type: string;
  placeholder?: string;
}

export interface FilterPayload {
  regNumber: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

export interface PlaybackPayload extends FilterPayload {
  speed: string;
}

export interface DateRange {
  from: Date;
  to: Date | undefined;
}

export interface fetchTrackingDataResponse<T> {
  meta: any[];
  data: T[];
  rows: number;
  statistics: any;
}

export interface HistoryData {
  heading: number;
  timestamp: string;
  latitude: string;
  longitude: string;
  tripId: string;
  poGeneratedBy: string;
  poGivenTo: string;
  truckId: string;
  registrationNo: string;
  eventData_ignitionStatus: string;
  speed?: string;
  deviceOdometer?: string;
}

export interface Stoppage {
  id: number;
  lat: number;
  lng: number;
  heading: number;
  startTime: string;
  endTime: string;
  durationMs: number;
}