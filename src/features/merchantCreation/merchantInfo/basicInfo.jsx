// components/signup/BasicInfo.tsx
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { categories } from "../../../constants/merchantForm";
import { useMerchantFormStore } from "../../../store/merchantFormStore";

const BasicInfo = () => {
  const { formData, updateForm, updatePinCode, pinData, updatedMerchantData } =
    useMerchantFormStore();
  const { basicInfo } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobileNumber") {
      if (/^\d{0,10}$/.test(value)) updateForm("basicInfo", name, value);
      return;
    }

    if (name === "pinCode") {
      if (/^\d{0,6}$/.test(value)) updatePinCode(value);
      return;
    }

    updateForm("basicInfo", name, value);
  };
  const isUpdating = Object.keys(updatedMerchantData).length > 0;
  return (
    <>
      {/* ------------------------------- */}
      {/*     FIRST ROWS (2 PER ROW)     */}
      {/* ------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Merchant / Shop Name"
          name="shopName"
          placeholder="Enter shop name"
          value={basicInfo.shopName}
          onChange={handleChange}
        />

        <InputField
          label="Contact Person Name"
          name="contactName"
          placeholder="Enter contact name"
          value={basicInfo.contactName}
          onChange={handleChange}
        />

        {/* CONTACT NUMBER */}
        <div className="form-group flex flex-col">
          <Label text="Contact Number" />
          <div className="flex gap-2">
            <div className="flex items-center px-3 bg-card/50 border border-[var(--borderBg-color)] rounded-xl">
              <span className="text-sm">+91</span>
            </div>
            <input
              type="tel"
              name="mobileNumber"
              placeholder="Enter 10-digit number"
              value={basicInfo.mobileNumber}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        <InputField
          label="Email ID"
          name="email"
          type="email"
          placeholder="merchant@example.com"
          readOnly={Object.keys(updateForm).length > 0}
          disabled={Object.keys(updateForm).length > 0}
          value={basicInfo.email}
          onChange={handleChange}
        />
        {!isUpdating && (
          //  PASSWORD
          <InputField
            label="Password"
            name="password"
            type="password"
            placeholder="merchant@123"
            value={basicInfo.password}
            onChange={handleChange}
          />
        )}
        <InputField
          label="GST Number"
          name="gstNumber"
          placeholder="Enter GST number"
          value={basicInfo.gstNumber}
          onChange={handleChange}
        />

        {/* BUSINESS CATEGORY */}
        <div className="form-group flex flex-col">
          <Label text="Business Category" />
          <select
            name="category"
            value={basicInfo.category}
            onChange={handleChange}
            className="form-input w-full"
            required
          >
            <option value="" disabled>
              Select category
            </option>
            {categories.map((item) => (
              <option key={item} value={item.toLowerCase()}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* PIN CODE */}
        <InputField
          label="Pin Code"
          name="pinCode"
          placeholder="Enter 6-digit PIN"
          value={basicInfo.pinCode}
          onChange={handleChange}
        />

        {/* CITY */}
        <div className="form-group flex flex-col">
          <Label text="City" />
          <select
            name="city"
            value={basicInfo.city?.trim()}
            onChange={handleChange}
            className="form-input w-full"
            required
          >
            <option value="" disabled>
              Select City
            </option>

            {pinData.length === 0 && (
              <option value={basicInfo.city?.trim()}>
                {basicInfo.city?.trim()}
              </option>
            )}

            {pinData.map((city) => (
              <option key={city} value={city?.trim()}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* STATE */}
        <InputField
          label="State"
          name="state"
          value={basicInfo.state}
          readOnly
        />
      </div>
    </>
  );
};

// -----------------------------
// Label & InputField
// -----------------------------
const Label = ({ text }) => (
  <label className="flex items-center gap-2 text-xs sm:text-sm font-medium">
    {text}
  </label>
);

const InputField = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  readOnly,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className="form-group flex flex-col">
      <Label text={label} />

      <div className="relative">
        <input
          type={isPassword && showPassword ? "text" : type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          className={`form-input pr-10 ${
            readOnly ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
          required
        />

        {/* SHOW/HIDE PASSWORD ICON */}
        {isPassword && !readOnly && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default BasicInfo;
