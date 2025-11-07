import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { MapPin, Search, Globe, MapPinCheck } from "lucide-react";
import { useMerchantFormStore } from "../../../store/merchantFormStore";

export default function LocationPicker() {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const { formData, updateForm, updatedMerchantData } = useMerchantFormStore();
  const { basicInfo } = formData;

  const [latitude, setLatitude] = useState(basicInfo.latitude || 11.9526);
  const [longitude, setLongitude] = useState(basicInfo.longitude || 79.7966);
  const [address, setAddress] = useState(basicInfo.fullAddress || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [mapMode, setMapMode] = useState("satellite");

  // Update form whenever lat/lng/address changes
  useEffect(() => {
    updateForm("basicInfo", "latitude", Number(latitude));
    updateForm("basicInfo", "longitude", Number(longitude));
    updateForm("basicInfo", "fullAddress", address);
  }, [latitude, longitude, address, updateForm]);

  // Map layers
  const satelliteLayer = useRef(
    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { maxZoom: 19, attribution: "Tiles © Esri" }
    )
  );

  const streetLayer = useRef(
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    })
  );

  const labelsLayer = useRef(
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}.png",
      { subdomains: "abcd", maxZoom: 19 }
    )
  );

  // Initialize map
  useEffect(() => {
    mapRef.current = L.map("map", {
      center: [latitude, longitude],
      zoom: 13,
      layers: [satelliteLayer.current, labelsLayer.current],
    });

    markerRef.current = L.marker([latitude, longitude], { draggable: true })
      .addTo(mapRef.current)
      .bindPopup("Selected Location")
      .openPopup();

    // Marker drag
    markerRef.current.on("dragend", async () => {
      const { lat, lng } = markerRef.current.getLatLng();
      const latNum = Number(lat.toFixed(6));
      const lngNum = Number(lng.toFixed(6));
      setLatitude(latNum);
      setLongitude(lngNum);
      await fetchAddress(latNum, lngNum);
    });

    // Map click
    mapRef.current.on("click", async (e) => {
      const { lat, lng } = e.latlng;
      const latNum = Number(lat.toFixed(6));
      const lngNum = Number(lng.toFixed(6));

      markerRef.current.setLatLng([latNum, lngNum]);
      setLatitude(latNum);
      setLongitude(lngNum);

      await fetchAddress(latNum, lngNum);
    });

    return () => mapRef.current.remove();
  }, []);

  // Watch updatedMerchantData and update map + marker when it arrives
  useEffect(() => {
    if (updatedMerchantData?.latitude && updatedMerchantData?.longitude) {
      const lat = updatedMerchantData.latitude;
      const lng = updatedMerchantData.longitude;
      const fullAddress = updatedMerchantData.fullAddress || "";

      setLatitude(lat);
      setLongitude(lng);
      setAddress(fullAddress);

      if (mapRef.current && markerRef.current) {
        mapRef.current.setView([lat, lng], 15);
        markerRef.current.setLatLng([lat, lng]);
      }
    }
  }, [updatedMerchantData]);

  const toggleMapMode = () => {
    const map = mapRef.current;
    if (!map) return;

    if (mapMode === "satellite") {
      map.removeLayer(satelliteLayer.current);
      map.removeLayer(labelsLayer.current);
      streetLayer.current.addTo(map);
      setMapMode("street");
    } else {
      map.removeLayer(streetLayer.current);
      satelliteLayer.current.addTo(map);
      labelsLayer.current.addTo(map);
      setMapMode("satellite");
    }
  };

  const fetchAddress = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      const fullAddress = data.display_name || "Unknown location";
      setAddress(fullAddress);
      updateForm("basicInfo", "latitude", lat);
      updateForm("basicInfo", "longitude", lng);
      updateForm("basicInfo", "fullAddress", fullAddress);
    } catch (err) {
      console.error("Error fetching address:", err);
    }
  };

  const handleLatLonChange = async () => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (!lat || !lng) return;

    mapRef.current.setView([lat, lng], 15);
    markerRef.current.setLatLng([lat, lng]);
    await fetchAddress(lat, lng);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}`
      );
      if (res.data.length > 0) {
        const { lat, lon, display_name } = res.data[0];
        const latNum = parseFloat(lat);
        const lngNum = parseFloat(lon);
        setLatitude(latNum);
        setLongitude(lngNum);
        setAddress(display_name);
        mapRef.current.setView([latNum, lngNum], 15);
        markerRef.current.setLatLng([latNum, lngNum]);
      } else {
        alert("Location not found");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium text-[var(--primary-color)]">
          <MapPin className="w-4 h-4" />
          Select Location ({mapMode === "satellite"
            ? "Satellite"
            : "Street"}{" "}
          View)
        </label>
      </div>

      {/* Lat/Lon Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Latitude</label>
          <input
            type="text"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            onBlur={handleLatLonChange}
            className="form-input"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Longitude</label>
          <input
            type="text"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            onBlur={handleLatLonChange}
            className="form-input"
          />
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search for address, city, or landmark..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-input"
        />
        <button
          onClick={handleSearch}
          className="bg-[var(--primary-color)] flex items-center gap-2 border border-[var(--borderBg-color)] text-xs font-semibold py-2 px-3 rounded-lg hover:opacity-80"
        >
          <Search className="w-4 h-4" /> Search
        </button>
      </div>

      {/* Map */}
      <div className="relative">
        <button
          onClick={toggleMapMode}
          className="absolute top-3 right-3 z-[1000] bg-gray-900/80 hover:bg-gray-800 text-white rounded-full p-2 shadow-lg transition"
          title={`Switch to ${
            mapMode === "satellite" ? "Street" : "Satellite"
          } View`}
        >
          <Globe className="w-5 h-5" />
        </button>

        <div
          id="map"
          className="w-full h-96 rounded-lg border border-gray-700 overflow-hidden"
        ></div>
      </div>

      {/* Address Display */}
      {address && (
        <div className="p-3 rounded-lg bg-green-500/5">
          <div className="flex items-center gap-2 text-[var(--primary-color)] mb-1">
            <MapPinCheck className="w-4 h-4" />
            <h3 className="font-semibold text-sm">Selected Location</h3>
          </div>
          <p className="text-xs ps-5">{address}</p>
        </div>
      )}
    </div>
  );
}
