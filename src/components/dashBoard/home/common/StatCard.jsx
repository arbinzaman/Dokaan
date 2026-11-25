import { ArrowUpRight } from "lucide-react";

const StatCard = ({ name, icon: Icon, value, subtext, color, onClick }) => {
  const safeColor = color || "#4F46E5";
  const interactiveProps = onClick
    ? {
        role: "button",
        tabIndex: 0,
        onClick,
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick(e);
          }
        },
      }
    : {};

  return (
    <div
      {...interactiveProps}
      className={`group bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-5 transition-all duration-200 ${
        onClick
          ? "cursor-pointer hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-zinc-400 truncate">
            {name}
          </p>
          <h3 className="mt-2 text-2xl sm:text-[26px] font-semibold tracking-tight text-slate-900 dark:text-zinc-50 tabular-nums truncate">
            {value}
          </h3>
          {subtext && (
            <p className="mt-1.5 text-xs text-slate-500 dark:text-zinc-400 inline-flex items-center gap-1">
              <span>{subtext}</span>
              {onClick && (
                <ArrowUpRight
                  size={13}
                  className="opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              )}
            </p>
          )}
        </div>

        {Icon && (
          <div
            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor: `${safeColor}14`,
              color: safeColor,
            }}
          >
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
