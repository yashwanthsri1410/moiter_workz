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
import { useMerchantFormStore } from "../../store/merchantFormStore";
import { useZustandStore } from "../../store/zustandStore";

const MerchantList = ({ scrollToTop, setFormOpen, setIsEditing }) => {
  const { merchantData } = useZustandStore();
  const { setUpdatedMerchantData, populateInfo, formData } =
    useMerchantFormStore();
  const [search, setSearch] = useState("");
  const [editRow, setEditRow] = useState(null); // currently editing merchant ID or index
  const [editedData, setEditedData] = useState({}); // temp editable data
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleEdit = (merchant, index) => {
    setIsEditing(true);
    scrollToTop();
    setUpdatedMerchantData(merchant);
    populateInfo(merchant);
    //------------------- For input field open ----------
    // setEditRow(index);
    // setEditedData({ ...merchant });
  };

  const handleChange = (e, key) =>
    setEditedData((prev) => ({ ...prev, [key]: e.target.value }));

  const handleCancel = () => {
    setEditRow(null);
    setEditedData({});
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
    <>
      <div className="px-5 py-4 rounded-[12px] bg-[var(--cards-bg)] shadow-[0_0_10px_var(--borderBg-color)] border border-[var(--borderBg-color)]">
        <div className="bg-card/30 rounded-xl basic-card">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center primary-color space-x-2">
              <Store className="w-4 h-4" />
              <h2 className="user-table-header">
                Existing Merchant Configurations
              </h2>
            </div>

            {/* Search */}
            <div className="search-box relative w-full sm:w-64">
              <Search
                size="14"
                className="absolute left-3 top-2 text-gray-400"
              />
              <input
                type="text"
                className="search-input !w-full pl-8 pr-2 py-1 sm:py-2 text-xs sm:text-sm rounded border border-gray-700 focus:outline-none"
                placeholder="Search Merchants..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </div>
          </div>
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

                      <td className="p-2 flex">
                        {editRow === i ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditRow(null)}
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
                            className="header-icon-box"
                            onClick={() => {
                              handleEdit(m, i);
                              setFormOpen(true);
                            }}
                          >
                            <SquarePen className="primary-color w-3 h-3" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="9" className="text-center py-4 text-gray-500">
                      {!paginatedData ||
                        (paginatedData?.length === 0 && "No Merchants found")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
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
    </>
  );
};

export default MerchantList;
