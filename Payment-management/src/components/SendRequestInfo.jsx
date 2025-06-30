import { useEffect } from "react";
import axios from "axios";

const SendRequestInfo = () => {
  useEffect(() => {
    const fetchClientInfo = async () => {
      try {
        const response = await axios.get("http://192.168.22.247/app1/api/Department/get-request-info", {
          headers: {
            "X-Custom-Header": "ClientInitCall", // optional custom header
          },
        });

        console.log("✅ Client Info received:", response.data);
      } catch (error) {
        console.error("❌ Error calling get-request-info:", error);
      }
    };

    fetchClientInfo();
  }, []);

  return null;
};

export default SendRequestInfo;
