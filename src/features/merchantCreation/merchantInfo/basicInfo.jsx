import { Store, ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  categories,
  merchantFormObj,
  samplePinData,
} from "../../../constants/merchantForm";

const BasicInfo = () => {
  const [formData, setFormData] = useState(merchantFormObj);
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update the state
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Auto-fill city and state based on pincode
    if (name === "pinCode" && value.length === 6) {
      const location = samplePinData[value];
      if (location) {
        setFormData((prev) => ({
          ...prev,
          city: location.city,
          state: location.state,
          pinCode: value,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          city: "",
          state: "",
          pinCode: value,
        }));
      }
    }
  };

  return (
    <>
      {/* Grid 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Merchant Name */}
        <InputField
          label="Merchant / Shop Name"
          name="merchantName"
          placeholder="Enter shop name"
          value={formData.merchantName}
          onChange={handleChange}
        />

        {/* Contact Person Name */}
        <InputField
          label="Contact Person Name"
          name="contactName"
          placeholder="Enter contact name"
          value={formData.contactName}
          onChange={handleChange}
        />

        {/* Contact Number */}
        <div className="form-group flex flex-col">
          <Label text="Contact Number" />
          <div className="flex gap-2">
            <div className="flex items-center px-3 bg-card/50 border border-[var(--borderBg-color)] rounded-xl">
              <span className="text-sm">+91</span>
            </div>
            <input
              type="tel"
              name="contactNumber"
              placeholder="Enter 10-digit number"
              value={formData.contactNumber}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        {/* Email */}
        <InputField
          label="Email ID"
          name="email"
          placeholder="merchant@example.com"
          value={formData.email}
          onChange={handleChange}
          type="email"
        />

        {/* GST */}
        <InputField
          label="GST Number"
          name="gstNumber"
          placeholder="Enter GST number"
          value={formData.gstNumber}
          onChange={handleChange}
        />

        {/* Business Category */}
        <div className="form-group flex flex-col">
          <Label text="Business Category" />
          <div className="relative">
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-input w-full"
            >
              <option value="">Select category</option>
              {categories.map((item, i) => (
                <option key={i} value={item.toLowerCase()}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pincode */}
        <InputField
          label="Pin Code"
          name="pinCode"
          placeholder="Enter 6-digit PIN"
          value={formData.pinCode}
          onChange={handleChange}
          maxLength={6}
        />
        {/* City */}
        <InputField
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
          readOnly
        />

        {/* State */}
        <InputField
          label="State"
          name="state"
          value={formData.state}
          onChange={handleChange}
          readOnly
        />
      </div>
    </>
  );
};

// 🔹 Reusable label component
const Label = ({ text }) => (
  <label className="flex items-center gap-2 text-xs sm:text-sm font-medium">
    {text}
  </label>
);

// 🔹 Reusable input component
const InputField = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  readOnly,
  maxLength,
}) => (
  <div className="form-group flex flex-col">
    <Label text={label} />
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      maxLength={maxLength}
      className={`form-input ${
        readOnly ? "bg-gray-100 cursor-not-allowed" : ""
      }`}
    />
  </div>
);

export default BasicInfo;
