import React, { createContext, useContext, useState } from "react";

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({
    message: "",
    type: "info",
    visible: false,
  });

  const showAlert = (message, type = "info") => {
    setAlert({ message, type, visible: true });
    setTimeout(() => setAlert({ ...alert, visible: false }), 3000); // auto close in 3s
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      {alert.visible && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
          <div
            style={{ boxShadow: "var(--alert-shadow)" }}
            className={`relative p-6 
    border-[var(--borderBg-color)] bg-[var(--menu-hover-bg)] backdrop-blur-md 
    text-teal-300 font-semibold min-w-[340px] transition-all duration-500 rounded-xl`}
          >
            {[
              "top-0 left-0",
              "top-0 right-0",
              "bottom-0 left-0",
              "bottom-0 right-0",
            ].map((pos, i) => {
              const isRight = pos.includes("right-0");
              return (
                <div
                  key={i}
                  className={`glow-corner ${pos} ${
                    isRight ? "glow-corner-right" : "glow-corner-left"
                  }`}
                />
              );
            })}

            {/* Title based on type */}
            <div className="flex items-center justify-between mb-2">
              <span className="uppercase tracking-wide text-sm text-gray-400">
                {alert.type === "error"
                  ? "Error"
                  : alert.type === "success"
                  ? "Success"
                  : "Notification"}
              </span>
              {/* Small icon */}
              <div
                style={{ boxShadow: "var(--alert-shadow)" }}
                className="w-3 h-3 rounded-full primary-bg"
              ></div>
            </div>

            {/* Message */}
            <div className="text-xl text-white leading-relaxed">
              {alert.message}
            </div>

            {/* Glow bar at the bottom */}
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent  via-[var(--primary-color)] to-transparent animate-pulse"></div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
};
