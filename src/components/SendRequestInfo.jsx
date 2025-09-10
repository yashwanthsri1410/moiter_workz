import { useEffect } from "react";
import axios from "axios";

const SendRequestInfo = () => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    const fetchClientInfo = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/app1/api/Department/get-request-info`, {
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
