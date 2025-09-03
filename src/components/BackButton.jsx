import React from "react";
import { useNavigate } from "react-router-dom";

import { ArrowLeftIcon } from "lucide-react";

export default function BackButton({ label = "Back" }) {
  const navigate = useNavigate();

  const handleBack = () => {
    // Go back one step in history
    navigate(-1);
    // OR: window.history.back();
  };

  return (
    <button
      onClick={handleBack}
      className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
    >
    <ArrowLeftIcon size={18} />  {label}
    </button>
  );
}
