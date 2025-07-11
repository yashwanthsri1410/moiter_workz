// usePublicIp.js
import { useEffect, useState } from "react";
import { getPublicIp } from "../services/ipService";

const usePublicIp = () => {
  const [ip, setIp] = useState(null);

  useEffect(() => {
    getPublicIp().then(setIp);
  }, []);

  return ip;
};

export default usePublicIp;
