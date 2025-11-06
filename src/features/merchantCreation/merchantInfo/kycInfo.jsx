import { FileText, Eye } from "lucide-react";
import { kycTypes, kycUploads } from "../../../constants/merchantForm";
import { fileToBase64 } from "../../../helper";
import { useMerchantFormStore } from "../../../store/merchantFormStore";

const KYCInfo = () => {
  const { formData, updateForm, updatedMerchantData } = useMerchantFormStore();
  const { kycInfo } = formData;

  const handleChange = async (e) => {
    const { name, files, value } = e.target;

    if (files) {
      const base64File = await fileToBase64(files[0]);
      updateForm("kycInfo", name, base64File);
    } else {
      updateForm("kycInfo", name, value);
    }
  };

  const openFile = (base64, fileName = "document.pdf") => {
    const link = document.createElement("a");
    link.href = `data:application/pdf;base64,${base64}`;
    link.download = fileName;
    link.click();
  };

  const getFileValue = (name) => {
    // priority: updated formData > existing merchant data
    return kycInfo[name] || updatedMerchantData?.[name] || "";
  };

  return (
    <div className="p-3 rounded-lg bg-chart border border-[var(--borderBg-color)]">
      <div className="flex items-center gap-2 primary-color">
        <FileText className="w-4 h-4" />
        <h3 className="user-table-header mandatory-space">KYC Information</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="form-group flex flex-col">
          <label className="flex items-center gap-2 text-sm mb-1">
            KYC Type
          </label>
          <select
            name="kycType"
            value={kycInfo.kycType || updatedMerchantData?.kycType || ""}
            onChange={handleChange}
            className="form-input w-full"
            required
          >
            <option value="" disabled hidden>
              Select KYC type
            </option>
            {kycTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {kycUploads.map((file) => {
          const fileValue = getFileValue(file.name);
          return (
            <div key={file.name} className="form-group flex flex-col relative">
              <label className="flex items-center gap-2 text-sm font-medium text-chart-5 mb-1">
                {file.label}
              </label>
              <input
                style={{ paddingBottom: "28px", paddingTop: "4px" }}
                type="file"
                name={file.name}
                required={!fileValue}
                onChange={handleChange}
                accept=".pdf,.jpg,.png"
                className="form-input"
              />
              {!kycInfo[file.name] && getFileValue(file.name) && (
                <button
                  type="button"
                  onClick={() =>
                    openFile(getFileValue(file.name), file.name + ".pdf")
                  }
                  className="absolute right-2 top-8 flex items-center gap-1 text-blue-600 text-sm"
                >
                  <Eye className="w-4 h-4" /> Preview
                </button>
              )}
              <p className="text-[10px] text-[#94a3b8] mt-1">{file.note}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KYCInfo;
