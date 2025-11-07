export const daysOfWeek = [
  { name: "monday" },
  { name: "tuesday" },
  { name: "wednesday" },
  { name: "thursday" },
  { name: "friday" },
  { name: "saturday" },
  { name: "sunday" },
];

export const samplePinData = {
  560001: { city: "Bangalore", state: "Karnataka" },
  110001: { city: "New Delhi", state: "Delhi" },
  400001: { city: "Mumbai", state: "Maharashtra" },
  600001: { city: "Chennai", state: "Tamil Nadu" },
  700001: { city: "Kolkata", state: "West Bengal" },
};

export const categories = [
  "Grocery",
  "Electronics",
  "Fashion",
  "Food",
  "Pharmacy",
  "Services",
];

export const locationInstructions = [
  "Search for your address using the search bar above",
  "Or click anywhere on the map to place a marker",
  "Drag the marker to adjust the exact location",
];

export const buttonOptions = [
  {
    title: "24/7",
    subtitle: "Always Open",
  },
  {
    title: "Business Hours",
    subtitle: "9 AM - 6 PM",
  },
  {
    title: "Copy to Weekdays",
    subtitle: "Mon → Tue-Fri",
  },
];

export const kycTypes = [
  { label: "Aadhaar", value: "aadhaar" },
  { label: "PAN", value: "pan" },
  { label: "Business License", value: "business_license" },
  { label: "Others", value: "others" },
];

export const kycUploads = [
  {
    label: "Upload KYC Document",
    name: "kycDocument",
    note: "PDF, JPG, PNG - Max 5MB",
  },
  {
    label: "Agreement Copy for KYC",
    name: "agreementCopy",
    note: "Upload agreement copy - PDF, JPG, PNG - Max 5MB",
  },
  {
    label: "ID Proof",
    name: "idProof",
    note: "Choose and upload ID proof - PDF, JPG, PNG - Max 5MB",
  },
  {
    label: "Address Proof",
    name: "addressProof",
    note: "Choose and upload address proof - PDF, JPG, PNG - Max 5MB",
  },
];

export const paymentOptions = [
  { id: "qrPaymentStatic", label: "QR Payment - Static" },
  { id: "qrPaymentDynamic", label: "QR Payment - Dynamic" },
  { id: "posSwipe", label: "POS Terminal – Swipe" },
  { id: "posInsert", label: "POS Terminal – Insert" },
  { id: "posTap", label: "POS Terminal – Tap" },
  { id: "all", label: "All", special: true },
];

export const columns = [
  { key: "shopName", label: "Merchant Name" },
  { key: "contactName", label: "Contact" },
  { key: "email", label: "Email" },
  { key: "gstNumber", label: "GST" },
  { key: "city", label: "City" },
  { key: "paymentType", label: "Payment" },
  { key: "mdrValue", label: "MDR" },
  { key: "remarks", label: "Remarks" },
  { key: "status", label: "Status" },
];

export const recheckMerchants = [
  {
    name: "Gadget World",
    gst: "33AABCU9603R1Z6",
    comment:
      "Please update the GST number format and verify the business address. Also, add more payment types for better customer experience.",
    date: "2024-01-22",
  },
];
