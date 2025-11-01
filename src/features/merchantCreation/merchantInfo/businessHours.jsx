import { useState } from "react";
import { Clock, ChevronRight, CircleAlert } from "lucide-react";
import {
  initialSchedule,
  daysOfWeek,
  buttonOptions,
} from "../../../constants/merchantForm";
const BusinessHours = () => {
  const [schedule, setSchedule] = useState(initialSchedule);

  const handleToggle = (dayName) => {
    setSchedule((prev) => ({
      ...prev,
      [dayName]: {
        ...prev[dayName],
        isOpen: !prev[dayName].isOpen,
      },
    }));
  };

  const handleTimeChange = (dayName, type, value) => {
    setSchedule((prev) => ({
      ...prev,
      [dayName]: {
        ...prev[dayName],
        [type]: value,
      },
    }));
  };

  return (
    <div className="p-3 rounded-lg bg-chart border border-[var(--borderBg-color)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 primary-color">
          <Clock className="w-4 h-4" aria-hidden="true" />
          <h3 className="user-table-header">Business Hours</h3>
        </div>
        <p className="text-[#94a3b8] text-xs">Set your operating hours</p>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
          {buttonOptions.map((btn, index) => (
            <button
              key={index}
              type="button"
              className="bg-[#0a0b0e] p-1 rounded-2xl border border-[var(--borderBg-color)] hover:bg-[#0082840D] text-primary hover:text-black"
            >
              {/* {btn.icon && <span className="flex-shrink-0">{btn.icon}</span>} */}
              <div className="text-center">
                <div className="text-sm font-medium">{btn.title}</div>
                <div className="text-xs opacity-70">{btn.subtitle}</div>
              </div>
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {daysOfWeek.map((day) => {
            const { isOpen, openingTime, closingTime } = schedule[day.name];
            return (
              <div
                key={day.name}
                className={`flex flex-col md:flex-row items-start md:items-center gap-4 p-4 transition-all rounded-2xl ${
                  isOpen ? "border border-chart" : ""
                }`}
              >
                {/* Left: Toggle + Day Name */}
                <div className="flex items-center gap-3 min-w-[140px]">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isOpen}
                    onClick={() => handleToggle(day.name)}
                    className={`peer inline-flex h-[1.15rem] w-8 items-center rounded-full border border-transparent transition-all outline-none ${
                      isOpen ? "bg-[#008284]" : "bg-[#1a1f2e]"
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-[#fff] transition-transform ${
                        isOpen
                          ? "translate-x-[calc(100%-2px)]"
                          : "translate-x-0"
                      }`}
                    />
                  </button>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium capitalize cursor-pointer">
                      {day.name}
                    </label>
                    <div className="text-xs text-muted-foreground">
                      {isOpen ? `${openingTime} - ${closingTime}` : "Closed"}
                    </div>
                  </div>
                </div>

                {/* Right: Time Inputs */}
                {isOpen && (
                  <div className="flex items-center gap-3 flex-1 w-full mt-2 md:mt-0">
                    <div className="flex-1 form-group">
                      <label className="text-xs text-muted-foreground mb-1 block">
                        Opening Time
                      </label>
                      <input
                        type="time"
                        value={openingTime}
                        onChange={(e) =>
                          handleTimeChange(
                            day.name,
                            "openingTime",
                            e.target.value
                          )
                        }
                        className="form-input"
                      />
                    </div>

                    <div className="text-muted-foreground pt-5 hidden md:block">
                      <ChevronRight className="w-4 h-4" />
                    </div>

                    <div className="flex-1 form-group">
                      <label className="text-xs text-muted-foreground mb-1 block">
                        Closing Time
                      </label>
                      <input
                        type="time"
                        value={closingTime}
                        onChange={(e) =>
                          handleTimeChange(
                            day.name,
                            "closingTime",
                            e.target.value
                          )
                        }
                        className="form-input"
                      />
                    </div>
                  </div>
                )}

                {/* Closed notice */}
                {!isOpen && (
                  <div className="flex-1 text-sm text-muted-foreground italic mt-2 md:mt-0">
                    This day is marked as closed
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-2 p-3 rounded bg-chart border border-chart">
          <CircleAlert
            className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary"
            aria-hidden="true"
          />
          <p className="text-xs text-muted-foreground text-[#94a3b8]">
            <span className="font-medium text-primary">Tip:</span> Use the
            preset buttons above to quickly set common schedules, then customize
            individual days as needed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BusinessHours;
