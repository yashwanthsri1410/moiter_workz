import { locationInstructions } from "../../../constants/merchantForm";
import { MapPin } from "lucide-react";

const LocationInfo = () => {
  return (
    <div className="flex flex-col items-start gap-2 p-3 rounded-lg bg-chart border border-[var(--borderBg-color)]">
      {/* Icon */}

      <div className="flex items-center gap-2 primary-color">
        <MapPin className="w-4 h-4" aria-hidden="true" />
        <h3 className="user-table-header">How to select location</h3>
      </div>

      {/* Instruction Text */}
      <ul className="text-xs text-[#94a3b8]  list-disc list-inside space-y-1 ps-5">
        {locationInstructions.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default LocationInfo;
