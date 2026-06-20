const navItems = [
  { icon: <i className="fas fa-home"></i>, active: true },
  { icon: <i className="fas fa-car"></i>, active: false },
  { icon: <i className="fas fa-chart-bar"></i>, active: false },
  { icon: <i className="fas fa-bell"></i>, active: false },
  { icon: <i className="fas fa-cog"></i>, active: false },
  // { icon: CreditCard, active: false },
  // { icon: Briefcase, active: false },
];

export default function Sidebar() {
  return (
    <aside className="flex w-14 shrink-0 flex-col items-center gap-5 bg-[#4B2C6D] py-4">
      {navItems.map(({ icon, active }, index) => (
        <button
          key={index}
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded text-white/90 transition-colors hover:bg-white/10"
          aria-label={`Navigation ${index + 1}`}
        >
          {icon}
          {active && (
            <span className="absolute right-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-sky-400" />
          )}
        </button>
      ))}
    </aside>
  );
}
