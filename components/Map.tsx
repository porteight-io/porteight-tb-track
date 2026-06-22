"use client";

import { useTracking } from "@/hooks/useTracking";
import { endMarkerIconUrl, startMarkerIconUrl } from "@/helpers/mapMarkerIcon";
import { APIProvider, Map, Marker, useMap } from "@vis.gl/react-google-maps";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { Menu, Printer, Settings } from "lucide-react";
import { useEffect } from "react";

function Polyline() {
  const map = useMap();
  const { trackPath } = useTracking();
  const mapsLibrary = useMapsLibrary("maps");
  const coreLibrary = useMapsLibrary("core");

  useEffect(() => {
    if (!map || !mapsLibrary || !coreLibrary || trackPath.length === 0) return;

    const polyline = new mapsLibrary.Polyline({
      path: trackPath,
      geodesic: true,
      strokeColor: "#4A90E2",
      strokeOpacity: 1,
      strokeWeight: 5,
    });

    polyline.setMap(map);

    const bounds = new coreLibrary.LatLngBounds();
    trackPath.forEach((point) => bounds.extend(point));
    map.fitBounds(bounds);

    return () => polyline.setMap(null);
  }, [map, mapsLibrary, coreLibrary, trackPath]);

  return null;
}

function RouteMarkers() {
  const { trackPath } = useTracking();
  const coreLibrary = useMapsLibrary("core");

  if (trackPath.length === 0 || !coreLibrary) return null;

  const iconSize = new coreLibrary.Size(64, 64);
  const iconAnchor = new coreLibrary.Point(24, 32);

  return (
    <>
      <Marker
        position={trackPath[0]}
        title="Start"
        icon={{
          url: startMarkerIconUrl,
          scaledSize: iconSize,
          anchor: iconAnchor,
        }}
      />
      <Marker
        position={trackPath[trackPath.length - 1]}
        title="End"
        icon={{
          url: endMarkerIconUrl,
          scaledSize: iconSize,
          anchor: iconAnchor,
        }}
      />
    </>
  );
}

function MapContent() {
  const { trackPath } = useTracking();

  return (
    <>
      <Map
        defaultCenter={{ lat: 28.6139, lng: 77.209 }}
        defaultZoom={15}
        gestureHandling="greedy"
        disableDefaultUI={false}
        className="h-full w-full"
      >
        {trackPath.length > 0 && <RouteMarkers />}
        <Polyline />
      </Map>

      <div className="absolute right-0 top-3 z-40 flex flex-col items-center gap-2">
        {[Menu, Printer, Settings].map((Icon, index) => (
          <button
            key={index}
            type="button"
            className={`flex h-9 w-9 items-center justify-center ${index === 0 ? "rounded-l-full mb-3 w-14" : "rounded-full"} bg-[#4B2C6D] text-white shadow-md`}
            aria-label={`Map action ${index + 1}`}
          >
            {index === 1 ? <i className="fas fa-print text-white text-xs"></i> : index === 2 ? <i className="fas fa-cog text-white text-xs"></i> : <Icon size={16} fill="white" />}
          </button>
        ))}
      </div>
    </>
  );
}

export default function MapPanel({ apiKey }: { apiKey: string }) {
  return (
    <section className="relative min-h-0 flex-1 overflow-hidden">
      <APIProvider apiKey={apiKey} libraries={["core", "maps", "geometry"]}>
        <MapContent />
      </APIProvider>
    </section>
  );
}
