import React, { useState, useMemo, useCallback } from "react";
import type { CalendarEvent } from "../../types";

type View = "month" | "week" | "day";

// --- Helper Functions ---
const getStartOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
};

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const isSameDay = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

// --- Icon Components ---
const ArrowLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-gray-500 dark:text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-gray-500 dark:text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

// --- Header Component ---
const CalendarHeader: React.FC<{
  currentDate: Date;
  view: View;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (view: View) => void;
}> = ({ currentDate, view, onPrev, onNext, onToday, onViewChange }) => {
  const getHeaderText = () => {
    switch (view) {
      case "month":
        return currentDate.toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
      case "week":
        const startOfWeek = getStartOfWeek(currentDate);
        const endOfWeek = addDays(startOfWeek, 6);
        return `${startOfWeek.toLocaleString("default", {
          month: "short",
          day: "numeric",
        })} - ${endOfWeek.toLocaleString("default", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`;
      case "day":
        return currentDate.toLocaleString("default", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        });
    }
  };

  const viewOptions: View[] = ["month", "week", "day"];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
      <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200 text-center sm:text-left">
        {getHeaderText()}
      </h2>
      <div className="flex items-center space-x-1 sm:space-x-2">
        <button
          onClick={onToday}
          className="px-3 py-1 text-sm rounded-md bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 transition-colors"
        >
          Today
        </button>
        <div className="p-1 bg-gray-200 dark:bg-slate-700 rounded-md flex">
          {viewOptions.map((v) => (
            <button
              key={v}
              onClick={() => onViewChange(v)}
              className={`px-2 py-0.5 text-sm rounded-md capitalize transition-colors ${
                view === v
                  ? "bg-indigo-200 dark:bg-indigo-500 text-indigo-700 dark:text-indigo-100"
                  : "hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        <button
          onClick={onPrev}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
        >
          <ArrowLeftIcon />
        </button>
        <button
          onClick={onNext}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
        >
          <ArrowRightIcon />
        </button>
      </div>
    </div>
  );
};

// --- Month View ---
interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}
const MonthView: React.FC<{
  calendarGrid: CalendarDay[];
  onDateClick: (date: Date) => void;
}> = ({ calendarGrid, onDateClick }) => (
  <>
    <div className="grid grid-cols-7 gap-2 text-center text-xs text-gray-500 dark:text-gray-400 font-semibold mb-2">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <div key={day}>{day}</div>
      ))}
    </div>
    <div className="grid grid-cols-7 grid-rows-6 gap-2 flex-grow">
      {calendarGrid.map(
        ({ date, isCurrentMonth, isToday, events: dayEvents }, index) => (
          <div
            key={index}
            className={`rounded-lg p-2 flex flex-col min-h-[100px] transition-colors cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 ${
              isCurrentMonth ? "bg-gray-100 dark:bg-slate-800" : "bg-gray-50 dark:bg-slate-800/50"
            }`}
            onClick={() => onDateClick(date)}
          >
            <span
              className={`text-xs font-bold mb-1 self-start ${
                isToday
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500 dark:text-indigo-100 rounded-full h-6 w-6 flex items-center justify-center"
                  : isCurrentMonth
                  ? "text-gray-700 dark:text-gray-200"
                  : "text-gray-400 dark:text-gray-500"
              }`}
            >
              {date.getDate()}
            </span>
            <div className="flex-grow overflow-y-auto overflow-x-hidden space-y-1">
              {dayEvents.slice(0, 2).map((event) => (
                <div
                  key={event.id}
                  className="text-xs bg-purple-100 dark:bg-purple-900/50 p-1 rounded text-gray-700 dark:text-purple-200"
                  title={event.title}
                >
                  <p className="font-semibold truncate">{event.title}</p>
                </div>
              ))}
              {dayEvents.length > 2 && (
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  +{dayEvents.length - 2} more
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
  </>
);

// --- Week View ---
const WeekView: React.FC<{
  currentDate: Date;
  events: CalendarEvent[];
  onDateClick: (date: Date) => void;
}> = ({ currentDate, events, onDateClick }) => {
  const weekDays = useMemo(() => {
    const start = getStartOfWeek(currentDate);
    return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
  }, [currentDate]);

  const today = new Date();

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-7 gap-2 text-center text-xs text-gray-500 dark:text-gray-400 font-semibold mb-2">
        {weekDays.map((day) => (
          <div
            key={day.toISOString()}
            onClick={() => onDateClick(day)}
            className="cursor-pointer"
          >
            <div>{day.toLocaleString("default", { weekday: "short" })}</div>
            <div
              className={`mt-1 font-bold text-lg ${
                isSameDay(day, today) ? "text-indigo-400" : "text-gray-700 dark:text-gray-200"
              }`}
            >
              {day.getDate()}
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 flex-grow overflow-y-auto">
        {weekDays.map((day) => {
          const dayEvents = events
            .filter((e) => isSameDay(e.start, day))
            .sort((a, b) => a.start.getTime() - b.start.getTime());
          return (
            <div
              key={day.toISOString()}
              className="bg-gray-100 dark:bg-slate-800 rounded-lg p-2 space-y-2 overflow-y-auto"
            >
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  className="text-xs bg-purple-100 dark:bg-purple-900/50 p-2 rounded text-gray-700 dark:text-purple-200"
                  title={`${event.title} - ${event.description || ""}`}
                >
                  <p className="font-semibold truncate">{event.title}</p>
                  <p className="text-purple-400">
                    {event.start.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Day View ---
const DayView: React.FC<{ currentDate: Date; events: CalendarEvent[] }> = ({
  currentDate,
  events,
}) => {
  const dayEvents = events
    .filter((e) => isSameDay(e.start, currentDate))
    .sort((a, b) => a.start.getTime() - b.start.getTime());
  const hours = Array.from({ length: 24 }).map((_, i) => i);

  const timeToPercent = (date: Date) => {
    return ((date.getHours() * 60 + date.getMinutes()) / (24 * 60)) * 100;
  };

  return (
    <div className="flex-grow overflow-y-auto">
      <div className="relative">
        {hours.map((hour) => (
          <div key={hour} className="h-14 border-t border-gray-200 dark:border-slate-700 flex">
            <div className="w-16 text-right pr-2 text-xs text-gray-400 dark:text-gray-500 pt-1">
              {new Date(0, 0, 0, hour).toLocaleTimeString([], {
                hour: "numeric",
                hour12: true,
              })}
            </div>
            <div className="flex-grow"></div>
          </div>
        ))}
        {dayEvents.map((event) => {
          const top = timeToPercent(event.start);
          const end = event.end || addDays(event.start, 1 / 24); // Default 1 hour if no end
          const height = Math.max(
            0.5,
            ((end.getTime() - event.start.getTime()) / (1000 * 60 * 60 * 24)) *
              100
          );

          return (
            <div
              key={event.id}
              className="absolute left-16 right-2 bg-purple-200 dark:bg-purple-900/60 p-2 rounded-lg border-l-4 border-purple-100 dark:border-purple-800 text-gray-700 dark:text-purple-100"
              style={{ top: `${top}%`, height: `${height}%` }}
              title={`${event.title} - ${event.description || ""}`}
            >
              <p className="text-sm font-semibold">{event.title}</p>
              <p className="text-xs text-purple-400">
                {event.start.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                -{" "}
                {end.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Main Calendar Component ---
const Calendar: React.FC<{ events: CalendarEvent[] }> = ({ events }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<View>("month");

  const calendarGrid: CalendarDay[] = useMemo(() => {
    if (view !== "month") return [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
    const lastDateOfPrevMonth = new Date(year, month, 0).getDate();

    const grid: CalendarDay[] = [];

    for (let i = firstDayOfMonth; i > 0; i--) {
      const date = new Date(year, month - 1, lastDateOfPrevMonth - i + 1);
      grid.push({ date, isCurrentMonth: false, isToday: false, events: [] });
    }

    const today = new Date();
    for (let i = 1; i <= lastDateOfMonth; i++) {
      const date = new Date(year, month, i);
      const isToday = isSameDay(date, today);
      const dayEvents = events
        .filter((e) => isSameDay(e.start, date))
        .sort((a, b) => a.start.getTime() - b.start.getTime());

      grid.push({ date, isCurrentMonth: true, isToday, events: dayEvents });
    }

    const remainingCells = 42 - grid.length;
    for (let i = 1; i <= remainingCells; i++) {
      const date = new Date(year, month + 1, i);
      grid.push({ date, isCurrentMonth: false, isToday: false, events: [] });
    }

    return grid;
  }, [currentDate, events, view]);

  const handlePrev = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      switch (view) {
        case "month":
          newDate.setMonth(prev.getMonth() - 1);
          break;
        case "week":
          newDate.setDate(prev.getDate() - 7);
          break;
        case "day":
          newDate.setDate(prev.getDate() - 1);
          break;
      }
      return newDate;
    });
  }, [view]);

  const handleNext = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      switch (view) {
        case "month":
          newDate.setMonth(prev.getMonth() + 1);
          break;
        case "week":
          newDate.setDate(prev.getDate() + 7);
          break;
        case "day":
          newDate.setDate(prev.getDate() + 1);
          break;
      }
      return newDate;
    });
  }, [view]);

  const handleToday = useCallback(() => setCurrentDate(new Date()), []);

  const handleDateClick = useCallback((date: Date) => {
    setCurrentDate(date);
    setView("day");
  }, []);

  return (
    <div className="flex flex-col h-full">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onViewChange={setView}
      />
      {view === "month" && (
        <MonthView calendarGrid={calendarGrid} onDateClick={handleDateClick} />
      )}
      {view === "week" && (
        <WeekView
          currentDate={currentDate}
          events={events}
          onDateClick={handleDateClick}
        />
      )}
      {view === "day" && <DayView currentDate={currentDate} events={events} />}
    </div>
  );
};

export default Calendar;