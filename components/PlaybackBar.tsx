"use client";

import { getPathDistanceKm } from "@/helpers/calculateDistance";
import { formatTimestamp, getPlaybackStats } from "@/helpers/playbackStats";
import { useTracking } from "@/hooks/useTracking";
import { Filter, Play } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";

function PlaybackSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  className = "",
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const percent = ((value - min) / (max - min)) * 100;

  const updateFromClientX = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const ratio = Math.min(
        1,
        Math.max(0, (clientX - rect.left) / rect.width),
      );
      onChange(min + ratio * (max - min));
    },
    [max, min, onChange],
  );

  return (
    <div
      ref={trackRef}
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      tabIndex={0}
      className={`relative h-2.5 w cursor-pointer rounded-full bg-[#e8eaed] ${className}`}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        updateFromClientX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          updateFromClientX(e.clientX);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
          e.preventDefault();
          onChange(Math.max(min, value - 1));
        }
        if (e.key === "ArrowRight" || e.key === "ArrowUp") {
          e.preventDefault();
          onChange(Math.min(max, value + 1));
        }
      }}
    >
      <div
        className="absolute inset-y-0 left-0 rounded-l-full bg-[#4B2C6D]"
        style={{ width: `${percent}%` }}
      />
      <div
        className="pointer-events-none absolute top-1/2 h-5 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-[#4B2C6D]"
        style={{ left: `${percent}%` }}
      />
    </div>
  );
}

export default function PlaybackBar() {
  const { trackPath, historyData, truckData } = useTracking();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState<number>(50);

  const totalDistance = useMemo(
    () => getPathDistanceKm(trackPath),
    [trackPath],
  );

  const playbackStats = useMemo(
    () => getPlaybackStats(historyData, trackPath, progress),
    [historyData, trackPath, progress],
  );

  const handlePlay = () => {
    setIsPlaying((prev) => !prev);
    if (!isPlaying) {
      alert("Play!");
    }
  };

  return (
    <section className="shrink-0">
      <div className="bg-[#4B2C6D] h-4 w-full ml-[1px] flex items-center justify-center">
        <div className="bg-[#35184D] h-full w-[126px] flex items-center justify-center">
          <i
            className="fas fa-angle-double-up text-white text-xs my-1"
            aria-hidden="true"
          ></i>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-[#eceef1] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full text-white bg-[#4B2C6D]"
            aria-label="Filter"
          >
            <Filter size={18} fill="white" />
          </button>

          <button
            type="button"
            onClick={handlePlay}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4B2C6D] text-white"
            aria-label={isPlaying ? "Stop" : "Play"}
          >
            <Play size={16} fill="white" className="ml-0.5" />
          </button>
        </div>
        <div>
          <PlaybackSlider
            value={progress}
            onChange={setProgress}
            className="w-[160px]"
          />
        </div>

        <div className="flex items-center gap-2">
          {[
            {
              label: "Speed",
              value: `${playbackStats.currentSpeed.toFixed(2)} kmph`,
            },
            {
              label: "Distance",
              value: `${totalDistance} km`,
            },
            {
              label: "Time",
              value: formatTimestamp(playbackStats.timestamp),
            },
            {
              label: "Total Distance",
              value: `${totalDistance} km`,
            },
            {
              label: "Avg. Speed (km/h)",
              value: `${playbackStats.avgSpeed.toFixed(2)} kmph`,
            },
            {
              label: "Max. Speed (km/h)",
              value: `${playbackStats.maxSpeed.toFixed(2)} kmph`,
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded flex items-center gap-1 px-3 py-1.5 text-center"
            >
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-[10px] font-medium bg-gray-300 px-3 py-0.5 rounded-md text-gray-600">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
