import { Bell, DollarSign, Menu, RefreshCw, Settings } from "lucide-react";
import Image from "next/image";

export default function UpperNavbar() {
  return (
    <header className="relative z-10 flex h-12 w-full shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-[0_2px_8px_rgba(0,0,0,0.09)]">
      <div className="flex items-center gap-5">
        <button
          type="button"
          className="flex items-center border border-gray-400 rounded-sm px-3 py-1 justify-center"
          aria-label="Menu"
        >
          <Menu size={20} className="text-gray-400" />
        </button>
        <h1 className="text-base text-gray-500">History</h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center text-gray-600"
          aria-label="Refresh"
        >
          {/* <RefreshCw size={18} color="#4B2C6D" /> */}
          <Image src="/refresh-v2.png" alt="Refresh" width={26} height={26} />
        </button>

        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center text-gray-600"
          aria-label="Settings"
        >
          <Settings size={20} color="#4B2C6D" />
        </button>
      </div>
    </header>
  );
}
