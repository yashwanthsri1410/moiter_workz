import { FileText, Upload } from "lucide-react";
import { kycTypes, kycUploads } from "../../../constants/merchantForm";
import { fileToBase64 } from "../../../helper";
import { useMerchantFormStore } from "../../../store/merchantFormStore";
import { useState } from "react";

const KYCInfo = () => {
  const { formData, updateForm } = useMerchantFormStore();
  const { kycInfo } = formData;

  const [previewFile, setPreviewFile] = useState(null);

  // Convert to base64
  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    updateForm("kycInfo", fieldName, base64);
  };

  // Preview thumbnail (100px)
  const getThumb = (base64) => {
    const isPDF =
      base64.startsWith("JVBER") || base64.toUpperCase().includes("%PDF");

    if (isPDF) {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full text-gray-300">
          <FileText className="w-6 h-6" />
          <span className="text-[10px] mt-1">PDF</span>
        </div>
      );
    }

    return (
      <img
        src={`data:image/*;base64,${base64}`}
        className="w-full h-full object-cover rounded-md"
        alt="doc"
      />
    );
  };

  const openPreview = (fileValue) => {
    if (!fileValue) return;
    const isPDF =
      fileValue.startsWith("JVBER") || fileValue.toUpperCase().includes("%PDF");
    setPreviewFile({ data: fileValue, type: isPDF ? "pdf" : "image" });
  };

  return (
    <>
      {/* FULL SCREEN PREVIEW */}
      {previewFile && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={() => setPreviewFile(null)}
        >
          <div className="max-w-4xl w-full max-h-[90vh]">
            {previewFile.type === "pdf" ? (
              <iframe
                src={`data:application/pdf;base64,${previewFile.data}`}
                className="w-full h-[90vh] rounded-xl bg-white"
              />
            ) : (
              <img
                src={`data:image/*;base64,${previewFile.data}`}
                className="w-full max-h-[90vh] object-contain rounded-xl"
              />
            )}
          </div>
        </div>
      )}

      {/* CARD */}
      <div className="p-3 rounded-lg bg-chart border border-[var(--borderBg-color)]">
        <div className="flex items-center gap-2 primary-color">
          <FileText className="w-4 h-4" />
          <h3 className="user-table-header mandatory-space">KYC Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* KYC TYPE */}
          <div className="form-group flex flex-col">
            <label className="text-sm">KYC Type</label>
            <select
              className="form-input"
              value={kycInfo.kycType || ""}
              onChange={(e) => updateForm("kycInfo", "kycType", e.target.value)}
            >
              <option value="">Select KYC type</option>
              {kycTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* DOCUMENT UPLOAD FIELDS */}
          {kycUploads.map((file) => {
            const fileValue = kycInfo[file.name];
            const inputId = `input-${file.name}`;

            return (
              <div className="flex flex-col gap-1" key={file.name}>
                <label className="text-sm">{file.label}</label>

                {/* 👉 IF FILE NOT UPLOADED — SHOW INPUT STYLE */}
                {!fileValue && (
                  <label
                    htmlFor={inputId}
                    className="w-full h-11 px-3 flex items-center gap-2 border border-[var(--borderBg-color)] rounded-lg bg-input cursor-pointer text-gray-400 text-sm"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload {file.label}</span>
                  </label>
                )}

                {/* HIDDEN INPUT */}
                <input
                  id={inputId}
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload(e, file.name)}
                />

                {/* 👉 IF FILE EXISTS — SHOW PREVIEW + EDIT */}
                {fileValue && (
                  <div className="flex items-center gap-3">
                    {/* Thumbnail */}
                    <div
                      className="w-[100px] h-[100px] border border-[var(--borderBg-color)] rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => openPreview(fileValue)}
                    >
                      {getThumb(fileValue)}
                    </div>

                    {/* Edit button */}
                    <button
                      type="button"
                      className="text-blue-500 text-sm underline"
                      onClick={() => document.getElementById(inputId).click()}
                    >
                      Change File
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default KYCInfo;
