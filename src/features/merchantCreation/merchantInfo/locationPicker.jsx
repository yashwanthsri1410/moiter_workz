// import React, { useState } from "react";
// import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import { Search, MapPin } from "lucide-react";
// import L from "leaflet";

// // Fix default marker icon issues in Leaflet
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
//   iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
// });

// const locationInstructions = [
//   "Search for your address using the search bar above",
//   "Or click anywhere on the map to place a marker",
//   "Drag the marker to adjust the exact location",
// ];

// // Move MapClickHandler OUTSIDE the main component
// const MapClickHandler = ({ setMarkerPosition }) => {
//   useMapEvents({
//     click(e) {
//       setMarkerPosition([e.latlng.lat, e.latlng.lng]);
//     },
//   });
//   return null;
// };

// const LocationPicker = () => {
//   const [formData, setFormData] = useState({ search: "" });
//   const [markerPosition, setMarkerPosition] = useState(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   return (
//     <div className="space-y-3">
//       {/* Label */}
//       <label className="flex items-center gap-2 text-sm font-medium text-chart-5 select-none">
//         <MapPin className="w-4 h-4" />
//         Select Location on Map
//       </label>

//       {/* Search Input */}
//       <div className="flex gap-2 flex-col md:flex-row">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 w-4 h-4 text-muted-foreground transform -translate-y-1/2" />
//           <input
//             type="text"
//             name="search"
//             value={formData.search}
//             onChange={handleChange}
//             placeholder="Search for address, city, landmark..."
//             className="flex h-9 w-full rounded-md border px-3 py-1 pl-10 text-base text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
//           />
//         </div>
//         <button
//           type="button"
//           disabled={!formData.search}
//           className="inline-flex items-center gap-2 rounded-md bg-chart-5 px-4 py-2 text-white hover:bg-chart-5/80 disabled:opacity-50 disabled:pointer-events-none"
//         >
//           <Search className="w-4 h-4" />
//           Search
//         </button>
//       </div>

//       {/* Leaflet Map */}
//       <div className="w-full h-96 rounded-lg border border-border overflow-hidden">
//         <MapContainer
//           center={[20, 77]}
//           zoom={5}
//           style={{ height: "100%", width: "100%" }}
//         >
//           <TileLayer
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
//           />
//           {markerPosition && <Marker position={markerPosition} />}
//           {/* Correctly render the click handler */}
//           <MapClickHandler setMarkerPosition={setMarkerPosition} />
//         </MapContainer>
//       </div>

//       {/* Instructions */}
//       <div className="flex items-start gap-2 p-3 rounded-lg bg-chart-5/5 border border-chart-5/20">
//         <MapPin className="w-4 h-4 text-chart-5 mt-0.5 flex-shrink-0" />
//         <div className="text-sm text-muted-foreground">
//           <p className="text-chart-5 font-medium mb-1">
//             How to select location:
//           </p>
//           <ul className="list-disc list-inside space-y-1">
//             {locationInstructions.map((item, idx) => (
//               <li key={idx}>{item}</li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LocationPicker;

const LocationPicker = () => {
  return <div>LocationPicker</div>;
};

export default LocationPicker;
