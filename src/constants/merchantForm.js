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

export const merchants = [
  {
    name: "Super Mart Grocery",
    contact: "Rajesh Kumar",
    email: "rajesh@supermart.com",
    gst: "29ABCDE1234F1Z5",
    city: "Mumbai",
    payment: "QR-Static, QR-Dynamic, POS-Swipe",
    mdr: "1.5%",
    status: "Active",
  },
  {
    name: "Tech Electronics Hub",
    contact: "Priya Sharma",
    email: "priya@techhub.com",
    gst: "27XYZAB5678G2H6",
    city: "Delhi",
    payment: "QR-Static, POS-Swipe, POS-Insert, POS-Tap",
    mdr: "2.0%",
    status: "Active",
  },
  {
    name: "Fashion Trends Store",
    contact: "Amit Patel",
    email: "amit@fashiontrends.com",
    gst: "24PQRST9012K3L7",
    city: "Bangalore",
    payment: "QR-Static, QR-Dynamic, POS-Tap",
    mdr: "1.8%",
    status: "Pending",
  },
  {
    name: "Spice Kitchen Restaurant",
    contact: "Neha Singh",
    email: "neha@spicekitchen.com",
    gst: "27AABCU9603R1Z4",
    city: "Pune",
    payment: "QR-Static, POS-Swipe, POS-Tap",
    mdr: "2.2%",
    status: "Rejected",
  },
  {
    name: "Health Plus Pharmacy",
    contact: "Dr. Suresh Reddy",
    email: "suresh@healthplus.com",
    gst: "36AABCU9603R1Z5",
    city: "Hyderabad",
    payment: "QR-Static, QR-Dynamic, POS-Swipe, POS-Insert, POS-Tap",
    mdr: "1.5%",
    status: "Active",
  },
];

export const columns = [
  { key: "shopName", label: "Merchant Name" },
  { key: "contactName", label: "Contact" },
  { key: "email", label: "Email" },
  { key: "gstNumber", label: "GST" },
  { key: "city", label: "City" },
  { key: "paymentType", label: "Payment" },
  { key: "mdrValue", label: "MDR" },
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
