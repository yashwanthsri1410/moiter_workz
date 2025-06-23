// src/hooks/useAuditLogger.js
import { useCallback } from "react";

export default function useAuditLogger() {
  const logAudit = useCallback(async (auditData) => {
    try {
      await fetch("http://192.168.22.247/api/Department/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...auditData,
          changedOn: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error("Audit log failed:", err);
    }
  }, []);

  return logAudit;
}
