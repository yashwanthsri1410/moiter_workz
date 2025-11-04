import { categories } from "../../../constants/merchantForm";
import { useMerchantFormStore } from "../../../store/merchantFormStore";

const BasicInfo = () => {
  const { formData, updateForm, updatePinCode, pinData, stateName } =
    useMerchantFormStore();
  const { basicInfo } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Mobile number validation: only digits, max 10
    if (name === "mobileNumber") {
      if (/^\d{0,10}$/.test(value)) updateForm("basicInfo", name, value);
      return;
    }

    // Pin code: only digits, max 6
    if (name === "pinCode") {
      if (/^\d{0,6}$/.test(value)) updatePinCode(value);
      return;
    }

    updateForm("basicInfo", name, value);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Merchant / Shop Name"
          name="shopName"
          placeholder="Enter shop name"
          value={basicInfo.shopName || ""}
          onChange={handleChange}
        />
        <InputField
          label="Contact Person Name"
          name="contactName"
          placeholder="Enter contact name"
          value={basicInfo.contactName || ""}
          onChange={handleChange}
        />

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
              value={basicInfo.mobileNumber || ""}
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
          value={basicInfo.email || ""}
          onChange={handleChange}
        />

        <InputField
          label="GST Number"
          name="gstNumber"
          placeholder="Enter GST number"
          value={basicInfo.gstNumber || ""}
          onChange={handleChange}
        />

        <div className="form-group flex flex-col">
          <Label text="Business Category" />
          <select
            name="category"
            value={basicInfo.category || ""}
            onChange={handleChange}
            className="form-input w-full"
            required
          >
            <option value="" disabled hidden>
              Select category
            </option>
            {categories.map((item) => (
              <option key={item} value={item.toLowerCase()}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <InputField
          label="Pin Code"
          name="pinCode"
          placeholder="Enter 6-digit PIN"
          value={basicInfo.pinCode || ""}
          onChange={handleChange}
        />

        <div className="form-group flex flex-col">
          <Label text="City" />
          <select
            name="city"
            value={basicInfo.city || ""}
            onChange={handleChange}
            className="form-input w-full"
            required
          >
            <option value="" disabled hidden>
              Select City
            </option>
            {pinData.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <InputField
          label="State"
          name="state"
          value={basicInfo.state || stateName || ""}
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
      className={`form-input ${
        readOnly ? "bg-gray-100 cursor-not-allowed" : ""
      }`}
      required
    />
  </div>
);

export default BasicInfo;
