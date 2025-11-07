import {
  Store,
  Search,
  CircleAlert,
  SquarePen,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { columns, recheckMerchants } from "../../constants/merchantForm";
import UseMerchantCreation from "../../hooks/useMerchantCreation";
import { useMerchantFormStore } from "../../store/merchantFormStore";

const MerchantList = ({ scrollToTop }) => {
  const { merchantData } = UseMerchantCreation();
  const { setUpdatedMerchantData } = useMerchantFormStore();
  const [search, setSearch] = useState("");
  const [editRow, setEditRow] = useState(null); // currently editing merchant ID or index
  const [editedData, setEditedData] = useState({}); // temp editable data
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const handleEdit = (merchant, index) => {
    scrollToTop();
    setUpdatedMerchantData(merchant);
    //------------------- For input field open ----------
    // setEditRow(index);
    // setEditedData({ ...merchant });
  };

  const handleChange = (e, key) => {
    setEditedData((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleCancel = () => {
    setEditRow(null);
    setEditedData({});
  };

  const handleUpdate = () => {
    setEditRow(null);
  };

  const filteredMerchants = merchantData?.filter((m) =>
    m?.shopName?.toLowerCase().includes(search?.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMerchants?.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Use paginated data for rendering
  const paginatedData = filteredMerchants?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <div className="px-5 py-4 rounded-[12px] bg-[var(--cards-bg)] shadow-[0_0_10px_var(--borderBg-color)] border border-[var(--borderBg-color)]">
      <div className="bg-card/30 rounded-xl basic-card">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center primary-color space-x-2">
            <Store className="w-4 h-4" />
            <h2 className="user-table-header">Merchant List</h2>
          </div>
          <div className="text-xs text-[#94a3b8]">
            Total: {merchantData?.length} merchants
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
            <input
              style={{ paddingLeft: "35px", borderRadius: "50px" }}
              type="text"
              placeholder="Search merchants..."
              className="form-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        {/* Recheck Section */}
        {/* {recheckMerchants.length > 0 && (
          <div className="mb-6 p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <div className="flex items-start gap-2">
              <CircleAlert className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-[16px] font-semibold text-yellow-500 mb-2">
                  Recheck Required ({recheckMerchants.length})
                </h3>
                <p className="text-xs text-[#94a3b8] tracking-wide mb-4">
                  The following merchants require updates based on Checker's
                  comments. Please review the comments, make necessary changes,
                  and resubmit.
                </p>

                <div className="space-y-3">
                  {recheckMerchants.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-card/50 rounded-lg border border-yellow-500/20"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-bold text-[#e2e8f0]">
                            {m.name}
                          </p>
                          <p className="text-xs text-[#94a3b8]">GST: {m.gst}</p>
                        </div>
                        <button
                          className="inline-flex items-center gap-1.5 px-3 h-8 rounded-2xl bg-yellow-600 text-xs font-bold text-white hover:bg-yellow-700"
                          // onClick={scrollToTop}
                        >
                          <SquarePen className="w-3 h-3" />
                          Edit & Resubmit
                        </button>
                      </div>
                      <div className="mt-3 p-3 bg-yellow-500/5 rounded border border-yellow-500/20">
                        <p className="text-xs font-semibold text-yellow-500 font-medium mb-1">
                          Checker's Comment:
                        </p>
                        <p className="text-xs text-[#e2e8f0]">{m.comment}</p>
                        <p className="text-xs text-[#94a3b8] mt-2">
                          Date: {m.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )} */}
        {/* Merchant Table */}
        {/* {filteredMerchants?.length === 0 && (
          <p className="text-sm text-red-500">Failed to Load Data</p>
        )} */}
        {filteredMerchants && filteredMerchants?.length > 0 && (
          <div className="rounded-lg overflow-hidden">
            <div className="table-container">
              <table className="w-full text-sm">
                <thead className="[&>tr]:border-b">
                  <tr>
                    {columns.map((col) => (
                      <th key={col.key}>{col.label}</th>
                    ))}
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData?.map((m, i) => (
                    <tr key={i} className="border-b hover:bg-muted/5">
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={`p-2 text-xs ${
                            col.key === "paymentType" &&
                            "max-w-[220px] truncate"
                          }`}
                          title={col.key === "paymentType" && m[col.key]}
                        >
                          {editRow === i ? (
                            <input
                              type="text"
                              value={editedData[col.key] || ""}
                              onChange={(e) => handleChange(e, col.key)}
                              className="w-full p-1 rounded bg-transparent border border-[#2e2e2e] text-[#e2e8f0] focus:outline-none"
                            />
                          ) : (
                            <span
                              className={
                                col.key === "shopName"
                                  ? "font-medium text-chart-5"
                                  : "text-[#94a3b8] truncate"
                              }
                            >
                              {m[col.key]}
                            </span>
                          )}
                        </td>
                      ))}

                      <td className="p-2 flex justify-center">
                        {editRow === i ? (
                          <div className="flex gap-2">
                            <button
                              onClick={handleUpdate}
                              className="p-1 bg-green-500/10 text-green-500 rounded hover:bg-green-500/20"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleCancel}
                              className="p-1 bg-red-500/10 text-red-500 rounded hover:bg-red-500/20"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEdit(m, i)}
                            className="p-1 hover:bg-chart-5/10 rounded"
                          >
                            <SquarePen className="w-4 h-4 text-[#94a3b8]" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* Pagination */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-center sm:justify-between items-center mt-4 px-4 gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm w-full sm:w-auto justify-center  ${
              currentPage === 1
                ? "prev-next-disabled-btn"
                : "prev-next-active-btn"
            }`}
          >
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" /> Prev
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm ${
                  currentPage === i + 1
                    ? "active-pagination-btn"
                    : "inactive-pagination-btn"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm w-full sm:w-auto justify-center ${
              currentPage === totalPages
                ? "prev-next-disabled-btn"
                : "prev-next-active-btn"
            }`}
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MerchantList;
