const navItems = [
  { icon: <i className="fas fa-home"></i>, active: true },
  { icon: <i className="fas fa-car"></i>, active: false },
  { icon: <i className="fas fa-chart-bar"></i>, active: false },
  { icon: <i className="fas fa-bell"></i>, active: false },
  { icon: <i className="fas fa-cog"></i>, active: false },
  { icon: <i className="fas fa-ticket-alt"></i>, active: false },
  { icon: <i className="fas fa-id-card-alt"></i>, active: false },
];

export default function Sidebar() {
  return (
    <aside className="flex w-14 shrink-0 flex-col items-center bg-[#4B2C6D] py-2">
      <div className="mt-11 flex flex-col gap-1">
        {navItems.map(({ icon, active }, index) => (
          <button
            key={index}
            type="button"
            className={`relative flex h-11 w-11 items-center justify-center rounded text-white/90 transition-colors hover:bg-white/10 ${active ? "bg-white/10" : ""}`}
            aria-label={`Navigation ${index + 1}`}
          >
            {icon}
            {active && (
              <span className={`absolute right-1 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-sky-300`} />
            )}
          </button>
        ))}
      </div>
    </aside>
  );
}
