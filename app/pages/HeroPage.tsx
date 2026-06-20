"use client";

import FilterBar from "@/components/FilterTabs";
import MapPanel from "@/components/Map";
import PlaybackBar from "@/components/PlaybackBar";
import Sidebar from "@/components/Sidebar";
import UpperNavbar from "@/components/UpperNavbar";

export default function HeroPage({
  googleMapsApiKey,
}: {
  googleMapsApiKey: string;
}) {
  return (
    <main className="flex h-screen bg-[#f0f1f3]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <UpperNavbar />
        <FilterBar />
        <div className="bg-[#4B2C6D] h-4 w-full ml-[1px] flex items-center justify-center">
          <div className="bg-[#35184D] h-full w-[126px] flex items-center justify-center">
            <i
              className="fas fa-angle-double-up text-white text-xs my-1"
              aria-hidden="true"
            ></i>
          </div>
        </div>
        <MapPanel apiKey={googleMapsApiKey} />
        <PlaybackBar />
      </div>
    </main>
  );
}
