import {
  detectStoppages,
  fetchTrackingHistory,
  getTodayString,
  validateFilters,
} from "@/helpers/validate";
import { FilterPayload, HistoryData, VehicleNumber } from "@/interfaces/interface";
import { getRegNo } from "@/services/regno.service";
import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTracking } from "@/hooks/useTracking";
import { RiArrowDropDownFill } from "@remixicon/react";

function formatTime24h(time: string) {
  const [hours = "0", minutes = "0"] = time.split(":");
  const parsed = new Date();
  parsed.setHours(Number(hours), Number(minutes), 0, 0);

  if (Number.isNaN(parsed.getTime())) return "00:00";

  return `${String(parsed.getHours()).padStart(2, "0")}:${String(parsed.getMinutes()).padStart(2, "0")}`;
}

function formatDateTimeDisplay(date: string, time: string) {
  if (!date) return "";

  const [year, month, day] = date.split("-");
  const formattedTime = formatTime24h(time || "00:00");

  return `${day}/${month}/${year} ${formattedTime}`;
}

function toDateTimeLocal(date: string, time: string) {
  return date && time ? `${date}T${time}` : "";
}

function fromDateTimeLocal(value: string) {
  const [date = "", time = ""] = value.split("T");
  return { date, time: formatTime24h(time.slice(0, 5)) };
}

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
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const dateRangeRef = useRef<HTMLDivElement>(null);

  const { setTrackPath, setTruckData, setStoppages, setHistoryData } = useTracking();

  useEffect(() => {
    const fetchAndSeed = async () => {
      try {
        const numbers = await getRegNo();
        setVehicleNumbers(numbers);
        console.log(numbers);

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

      if (
        dateRangeRef.current &&
        !dateRangeRef.current.contains(event.target as Node)
      ) {
        setIsDateRangeOpen(false);
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

  const dateRangeLabel = useMemo(() => {
    if (!startDate || !endDate) return "Select date range";
    return `${formatDateTimeDisplay(startDate, startTime)} - ${formatDateTimeDisplay(endDate, endTime)}`;
  }, [startDate, startTime, endDate, endTime]);

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

      const flattenedData = (response?.data?.flat() || []) as HistoryData[];

      const coordinates = flattenedData.map((item) => ({
        lat: Number(item.latitude),
        lng: Number(item.longitude),
      }));

      setTrackPath(coordinates);
      setHistoryData(flattenedData);
      setStoppages(detectStoppages(flattenedData));

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
      setStoppages([]);
      setHistoryData([]);
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
        <div className="flex items-center justify-between gap-4">
          <div ref={dropdownRef} className="relative min-w-[260px] flex-1">
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
                className="w-full bg-transparent text-sm text-gray-400 outline-none"
              />
              <RiArrowDropDownFill size={16} className="absolute right-0 top-3 mr-2 text-slate-500" />
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
                        setTrackPath([]);
                        setHistoryData([]);
                        setStoppages([]);
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

          <div ref={dateRangeRef} className="relative">
            <button
              type="button"
              onClick={() => setIsDateRangeOpen((open) => !open)}
              className="flex h-9 items-center whitespace-nowrap rounded border border-gray-300 bg-white px-3 text-[13px] text-gray-500 w-[265px]"
            >
              {dateRangeLabel}
            </button>

            {isDateRangeOpen && (
              <div className="absolute z-50 mt-1 flex items-center gap-2 rounded border border-gray-300 bg-white p-2 shadow-lg">
                <input
                  type="datetime-local"
                  lang="en-GB"
                  value={toDateTimeLocal(startDate, startTime)}
                  max={toDateTimeLocal(endDate, endTime) || undefined}
                  onChange={(e) => {
                    const { date, time } = fromDateTimeLocal(e.target.value);
                    setStartDate(date);
                    setStartTime(time);
                  }}
                  className="compact-datetime w-[150px] rounded border border-gray-200 px-2 py-1 text-xs outline-none"
                />
                <span className="text-xs text-gray-400">-</span>
                <input
                  type="datetime-local"
                  lang="en-GB"
                  value={toDateTimeLocal(endDate, endTime)}
                  min={toDateTimeLocal(startDate, startTime) || undefined}
                  onChange={(e) => {
                    const { date, time } = fromDateTimeLocal(e.target.value);
                    setEndDate(date);
                    setEndTime(time);
                  }}
                  className="compact-datetime w-[150px] rounded border border-gray-200 px-2 py-1 text-xs outline-none"
                />
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="h-9 rounded bg-[#4B2C6D] px-5 text-xs font-medium text-white transition-colors hover:bg-[#3d2459] disabled:opacity-60"
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
