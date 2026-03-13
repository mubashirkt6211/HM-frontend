/**
 * Calendar Page - View and manage doctor appointments using CalendarKit Pro
 */
import { useState } from "react";

export default function CalendarPage() {
  const [view, setView] = useState("month");

  return (
    <div className="w-full h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">CalendarKit Pro Calendar</h1>
        <p className="text-lg text-gray-600">Current View: {view}</p>
        <div className="mt-6 space-x-2">
          <button 
            onClick={() => setView("month")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Month
          </button>
          <button 
            onClick={() => setView("week")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Week
          </button>
          <button 
            onClick={() => setView("day")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Day
          </button>
        </div>
      </div>
    </div>
  );
}
