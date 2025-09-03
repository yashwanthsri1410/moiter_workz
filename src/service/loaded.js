import axios from "axios";

export const loadedDashboard = async (url) => {
  try {
    const res = await axios.get(url);
    return res;
  } catch (e) {
    return e.message;
  }
};
