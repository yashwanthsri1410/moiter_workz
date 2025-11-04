import { daysOfWeek } from "../constants/merchantForm";

export const initialSchedule = daysOfWeek.reduce((acc, day) => {
  const isClosed = day.name === "sunday"; // Sunday closed by default

  acc[day.name] = {
    day: day.name,
    isClosed,
    open: !isClosed ? "09:00" : "",
    close: !isClosed ? "18:00" : "",
  };

  return acc;
}, {});

export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
