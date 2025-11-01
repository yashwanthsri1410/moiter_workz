// src/components/CustomConfirm.tsx
import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";


const CustomConfirm = ({ message, resolve }) => {
  useEffect(() => {
    // Prevent background scroll
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40"></div>
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999] backdrop-blur-sm">
        <div className="guidelines-card">
          <h2 className="form-title mb-3">Confirm Action</h2>
          <p
            className="text-gray-300 leading-relaxed "
            dangerouslySetInnerHTML={{ __html: message }}
          ></p>
          <div className="flex justify-center gap-4 mt-3">
            <button
              onClick={() => resolve(false)}
              className="btn-outline-reset flex items-center justify-center gap-1.5 px-3 py-1.5 w-full sm:w-auto text-red"
            >
              No
            </button>
            <button
              onClick={() => resolve(true)}
              className="btn-outline-reset flex items-center justify-center gap-1.5 px-3 py-1.5 w-full sm:w-auto"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </>

  );
};

/**
 * Replaces window.confirm with a custom Tailwind-styled modal.
 * Usage:
 *   const confirmed = await customConfirm("Are you sure?");
 */
export const customConfirm = (message) => {
  return new Promise((resolve) => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const root = createRoot(container);

    const handleResolve = (result) => {
      root.unmount();
      container.remove();
      resolve(result);
    };

    root.render(<CustomConfirm message={message} resolve={handleResolve} />);
  });
};

export default customConfirm;
