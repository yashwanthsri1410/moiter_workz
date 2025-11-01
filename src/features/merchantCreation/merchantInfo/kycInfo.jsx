import { FileText } from "lucide-react";
import { useState } from "react";
import { kycTypes, kycUploads } from "../../../constants/merchantForm";

const KYCInfo = () => {
  const [formData, setFormData] = useState({
    kycType: "",
    kycDocument: null,
    agreementCopy: null,
    idAddressProof: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  return (
    <div className="p-3 rounded-lg bg-chart border border-[var(--borderBg-color)]">
      {/* Heading */}
      <div className="flex items-center gap-2 primary-color">
        <FileText className="w-4 h-4" />
        <h3 className="user-table-header">KYC Information</h3>
      </div>

      {/* KYC Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="form-group flex flex-col">
          <label className="flex items-center gap-2 text-sm text-[] mb-1">
            KYC Type
          </label>
          <div className="relative">
            <select
              name="kycType"
              value={formData.kycType}
              onChange={handleChange}
              className="form-input w-full"
            >
              <option value="">Select KYC type</option>
              {kycTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* File Uploads */}
        {kycUploads.map((file) => (
          <div key={file.name} className="form-group flex flex-col">
            <label className="flex items-center gap-2 text-sm font-medium text-chart-5 mb-1">
              {file.label}
            </label>
            <div className="relative">
              <input
                style={{ paddingBottom: "28px", paddingTop: "4px" }}
                type="file"
                name={file.name}
                onChange={handleChange}
                accept=".pdf,.jpg,.jpeg,.png"
                className="form-input"
              />
            </div>
            <p className="text-[10px] text-muted-foreground text-[#94a3b8] mt-1">
              {file.note}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KYCInfo;
