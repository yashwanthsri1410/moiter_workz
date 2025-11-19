import { Clock, ChevronRight } from "lucide-react";
import { daysOfWeek } from "../../../constants/merchantForm";
import { useMerchantFormStore } from "../../../store/merchantFormStore";
import { useEffect } from "react";

const BusinessHours = () => {
  const { formData, updateBusinessHours, updatedMerchantData } =
    useMerchantFormStore();
  const { businessHours } = formData;

  useEffect(() => {
    if (Array.isArray(updatedMerchantData?.businessHours)) {
      updatedMerchantData.businessHours.forEach((item) => {
        const day = item.day_of_week || ""; // fallback
        if (!day) return; // skip invalid entries

        // ✅ Defensive normalization
        const isClosed = item.is_closed === true; // treat null/false/undefined as false
        const open = item.open_time ? item.open_time.slice(0, 5) : "";
        const close = item.close_time ? item.close_time.slice(0, 5) : "";

        updateBusinessHours(day, "isClosed", isClosed);
        updateBusinessHours(day, "open", open);
        updateBusinessHours(day, "close", close);
      });
    }
  }, [updatedMerchantData, updateBusinessHours]);

  const handleToggle = (day) => {
    const current = businessHours[day]?.isClosed ?? true; // default closed if undefined/null
    const newIsClosed = !current;

    updateBusinessHours(day, "isClosed", newIsClosed);
    if (newIsClosed) {
      updateBusinessHours(day, "open", "");
      updateBusinessHours(day, "close", "");
    } else {
      updateBusinessHours(day, "open", "09:00");
      updateBusinessHours(day, "close", "18:00");
    }
  };

  const handleTimeChange = (day, type, value) => {
    updateBusinessHours(day, type, value);
  };

  return (
    <div className="p-3 rounded-lg bg-chart border border-[var(--borderBg-color)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 primary-color">
          <Clock className="w-4 h-4" />
          <h3 className="user-table-header mandatory-space">Business Hours</h3>
        </div>
        <p className="text-[#94a3b8] text-xs">Set your operating hours</p>
      </div>

      <div className="space-y-3 mt-3">
        {daysOfWeek.map((day) => {
          const {
            isClosed = true,
            open = "",
            close = "",
          } = businessHours?.[day.name] || {}; // ✅ default closed

          return (
            <div
              key={day.name}
              className={`flex flex-col md:flex-row items-start md:items-center gap-4 p-4 rounded-2xl ${
                !isClosed ? "border border-chart" : ""
              }`}
            >
              <div className="flex items-center gap-3 min-w-[140px]">
                <button
                  type="button"
                  role="switch"
                  aria-checked={!isClosed}
                  onClick={() => handleToggle(day.name)}
                  className={`peer inline-flex h-[1.15rem] w-8 items-center rounded-full transition-all ${
                    !isClosed ? "primary-bg" : "bg-[#1a1f2e]"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      !isClosed
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
                    {!isClosed ? `${open} - ${close}` : "Closed"}
                  </div>
                </div>
              </div>

              {!isClosed ? (
                <div className="flex items-center gap-3 flex-1 w-full mt-2 md:mt-0">
                  <div className="flex-1 form-group">
                    <label className="text-xs text-muted-foreground mb-1 block">
                      Opening Time
                    </label>
                    <input
                      type="time"
                      value={open}
                      onChange={(e) =>
                        handleTimeChange(day.name, "open", e.target.value)
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
                      value={close}
                      onChange={(e) =>
                        handleTimeChange(day.name, "close", e.target.value)
                      }
                      className="form-input"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex-1 text-sm text-muted-foreground italic mt-2 md:mt-0">
                  This day is marked as closed
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BusinessHours;
