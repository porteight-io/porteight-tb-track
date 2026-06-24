"use client";

import { getPathDistanceKm } from "@/helpers/calculateDistance";
import {
  formatTimestamp,
  getPlaybackStats,
} from "@/helpers/playbackStats";
import { useTracking } from "@/hooks/useTracking";
import { Filter, Play } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function PlaybackBar() {
  const { trackPath, historyData, truckData } = useTracking();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    setIsPlaying(false);
  }, [truckData.truck_no, historyData]);

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

      <div className="flex flex-wrap items-center gap-3 bg-[#eceef1] px-4 py-2.5">
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

        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          className="h-1.5 min-w-[160px] cursor-pointer accent-[#4B2C6D]"
        />

        <div className="flex flex-wrap items-center gap-2">
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
