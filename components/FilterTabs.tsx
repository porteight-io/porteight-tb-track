import {
  fetchTrackingHistory,
  getTodayString,
  validateFilters,
} from "@/helpers/validate";
import { FilterPayload, VehicleNumber } from "@/interfaces/interface";
import { getRegNo } from "@/services/regno.service";
import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTracking } from "@/hooks/useTracking";

export default function FilterBar() {
  const [regNumber, setRegNumber] = useState("Truck No.");
  const [vehicleNumbers, setVehicleNumbers] = useState<VehicleNumber[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const { setTrackPath, setTruckData } = useTracking();

  useEffect(() => {
    const fetchAndSeed = async () => {
      try {
        const numbers = await getRegNo();
        setVehicleNumbers(numbers);

        const first = numbers?.[0];
        if (first) {
          setRegNumber(first.registrationNo);
          setStartDate(getTodayString());
          setEndDate(getTodayString());
          setStartTime("00:00");
          setEndTime("23:59");
          setTruckData({
            truck_no: first.registrationNo,
            eventStatus: "OFF",
            model: first.model || "",
          });
        }
      } catch (err) {
        console.error("Failed to load registration numbers:", err);
      }
    };

    fetchAndSeed();
  }, [setTruckData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    getRegNo().then(setVehicleNumbers).catch(console.error);
  }, []);

  const buildPayload = useCallback(
    (): FilterPayload => ({
      regNumber,
      startDate,
      endDate,
      startTime,
      endTime,
    }),
    [regNumber, startDate, endDate, startTime, endTime],
  );

  const filteredVehicles = useMemo(() => {
    return vehicleNumbers.filter((item) =>
      item.registrationNo.toLowerCase().includes(search.toLowerCase()),
    );
  }, [vehicleNumbers, search]);

  const selectedVehicle = useMemo(
    () =>
      vehicleNumbers.find((item) => item.registrationNo === regNumber) ?? null,
    [vehicleNumbers, regNumber],
  );

  const handleSubmit = async () => {
    const payload = buildPayload();
    const validationError = validateFilters(payload);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const fromDate = new Date(`${startDate}T${startTime}:00`);
      const toDate = new Date(`${endDate}T${endTime}:00`);

      const response = await fetchTrackingHistory(regNumber, {
        from: fromDate,
        to: toDate,
      });

      const flattenedData = response?.data?.flat() || [];

      const coordinates = flattenedData.map((item: { latitude: string; longitude: string }) => ({
        lat: Number(item.latitude),
        lng: Number(item.longitude),
      }));

      setTrackPath(coordinates);

      const latestEvent = flattenedData[flattenedData.length - 1];

      setTruckData({
        truck_no: regNumber,
        eventStatus: latestEvent?.eventData_ignitionStatus,
        lat: Number(latestEvent?.latitude),
        lng: Number(latestEvent?.longitude),
        model: selectedVehicle?.model || "",
      });
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch tracking data.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="shrink-0 border-b border-gray-200 bg-white px-4 py-1">
      {error && (
        <p className="mb-2 text-xs font-medium text-red-500">{error}</p>
      )}

      <div className="flex items-center gap-3 w-full justify-between">
        <div className="flex items-center justify-between gap-3">
          <div ref={dropdownRef} className="relative min-w-[200px] flex-1">
            <div className="flex h-9 items-center rounded border border-gray-300 bg-white px-3">
              <input
                type="text"
                value={search || regNumber}
                placeholder="Select vehicle..."
                onFocus={() => setIsDropdownOpen(true)}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setRegNumber(e.target.value);
                  setIsDropdownOpen(true);
                }}
                className="w-full bg-transparent text-sm text-gray-700 outline-none"
              />
              <ChevronDown size={16} className="shrink-0 text-gray-500" />
            </div>

            {isDropdownOpen && (
              <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded border bg-white shadow-lg">
                {filteredVehicles.length > 0 ? (
                  filteredVehicles.map((item) => (
                    <button
                      key={item.registrationNo}
                      type="button"
                      className="w-full cursor-pointer border-b px-4 py-2 text-left text-sm hover:bg-slate-100"
                      onClick={() => {
                        setRegNumber(item.registrationNo);
                        setSearch(item.registrationNo);
                        setTruckData((prev) => ({
                          ...prev,
                          truck_no: item.registrationNo,
                          model: item.model || "",
                        }));
                        setIsDropdownOpen(false);
                      }}
                    >
                      {item.registrationNo}
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-sm text-gray-500">
                    No vehicle found
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex h-9 items-center gap-1 rounded border border-gray-300 bg-white px-2 text-sm text-gray-600">
            <input
              type="date"
              value={startDate}
              max={endDate || undefined}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-[118px] border-0 bg-transparent outline-none"
            />
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-[72px] border-0 bg-transparent outline-none"
            />
            <span className="px-1 text-gray-400">-</span>
            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-[118px] border-0 bg-transparent outline-none"
            />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-[72px] border-0 bg-transparent outline-none"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="h-9 rounded bg-[#4B2C6D] px-6 text-xs font-medium text-white transition-colors hover:bg-[#3d2459] disabled:opacity-60"
          >
            {isLoading ? "Loading..." : "Search"}
          </button>
        </div>
        <div>
          <button
            type="button"
            className="ml-auto h-9 rounded bg-[#E86C6C] px-5 text-xs font-medium text-white transition-colors hover:bg-[#d95a5a]"
          >
            Back To Dashboard
          </button>
        </div>
      </div>
    </section>
  );
}
