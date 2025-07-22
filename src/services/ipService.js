// ipService.js
let cachedIp = null;

export const getPublicIp = async () => {
  if (cachedIp) return cachedIp;

  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    cachedIp = data.ip;
    return cachedIp;
  } catch (err) {
    console.error("Failed to fetch IP:", err);
    return "UNKNOWN";
  }
};
