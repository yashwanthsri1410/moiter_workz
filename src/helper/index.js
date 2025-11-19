import { daysOfWeek } from "../constants/merchantForm";

const initialSchedule = daysOfWeek.reduce((acc, day) => {
  const isClosed = day.name === "sunday"; // Sunday closed by default

  acc[day.name] = {
    day: day.name,
    isClosed,
    open: !isClosed ? "09:00" : "",
    close: !isClosed ? "18:00" : "",
  };

  return acc;
}, {});

export const initialFormData = {
  basicInfo: {
    shopName: "",
    contactName: "",
    mobileNumber: "",
    email: "",
    password: "",
    gstNumber: "",
    category: "",
    pinCode: "",
    city: "",
    state: "",
    idProof: "",
    addressProof: "",
    latitude: 11.9526,
    longitude: 79.7966,
    fullAddress: "",
  },
  businessHours: initialSchedule,
  kycInfo: {},
  paymentConfig: {
    paymentType: "",
    mdrMode: "Percentage",
    mdrValue: "",
  },
  termsAndConditions: false,
};

export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]); // strip "data:...base64,"
    reader.onerror = (error) => reject(error);
  });
};
