import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  EyeIcon,
  Filter,
  Search,
  UserCheck2Icon,
} from "lucide-react";
import MerchantView from "./merchantview";
import { paginationStyle } from "../constants";
import { getMerchantData } from "../services/service";

export default function MerchantApproval() {
  const [merchants, setMerchants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const itemsPerPage = 8;
  console.log(merchants)
  useEffect(() => {
    fetchMerchants();
  }, []);

const fetchMerchants = async () => {
  try {
    const res = await getMerchantData();
    // Filter merchants where status is 1 or 3
    const filteredMerchants = res.data.filter(
      (merchant) => merchant.status === 1 || merchant.status === 3
    );
    setMerchants(filteredMerchants);
  } catch (err) {
    console.error("Error fetching merchants:", err);
  }
};

  // ✅ Filter + Search
  const filteredMerchants = merchants.filter((m) => {
    const query = searchQuery.toLowerCase();
    return Object.values(m).some(
      (value) => value && value.toString().toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filteredMerchants.length / itemsPerPage);

  const paginatedMerchants = filteredMerchants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <>
      {selectedMerchant ? (
        <MerchantView
          selectedMerchant={selectedMerchant}
          setSelectedMerchant={setSelectedMerchant}
          fetchMerchants={fetchMerchants}
        />
      ) : (
        <>
          {/* Header */}
          <div className="card-header flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="header-icon-box">
                <UserCheck2Icon className="primary-color w-4 h-4" />
              </div>
              <div>
                <h1 className="user-title">Merchant Approvals</h1>
                <p className="user-subtitle text-nowrap">
                  Review and approve onboarded merchants
                </p>
              </div>
            </div>

            <div className="card-header-right flex justify-center sm:justify-end w-full">
              <div className="portal-info text-center sm:text-right">
                <p className="portal-label text-center sm:text-right">
                  {merchants.length} total
                </p>
                <p className="portal-link">Checker Portal</p>
              </div>
            </div>
          </div>

          {/* Filters + Pagination */}
          <div className="tables-search-card rounded-xl p-3 flex flex-col gap-3 items-center md:items-start mt-6">
            <div className="flex flex-col items-center md:flex-row gap-2 w-full">
              <div className="relative flex-1">
                <Search
                  size="14"
                  className="absolute left-3 top-2 text-gray-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="search-input-approval !w-full md:w-auto"
                  placeholder="Search merchants..."
                />
              </div>

              <button
                onClick={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="reset-btn"
              >
                <Filter className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center md:justify-start gap-2 w-full">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`w-6 h-6 flex items-center justify-center rounded-md transition ${currentPage === 1
                  ? "bg-[#0f131d] text-gray-500 cursor-not-allowed"
                  : "bg-[#0f131d] text-white hover:border hover:border-[var(--primary-color)]"
                  }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className={paginationStyle}>{currentPage}</span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`w-6 h-6 flex items-center justify-center rounded-md transition ${currentPage === totalPages
                  ? "bg-[#0f131d] text-gray-500 cursor-not-allowed"
                  : "bg-[#0f131d] text-white hover:border hover:border-[var(--primary-color)]"
                  }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="table-card mt-[18px]">
            <div className="table-header">
              <div className="flex items-center gap-2 primary-color">
                <UserCheck2Icon className="w-4 h-4" />
                <p className="user-table-header">Onboarded Merchants</p>
              </div>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>SHOP NAME</th>
                    <th>CONTACT NAME</th>
                    <th>MOBILE</th>
                    <th>EMAIL</th>
                    <th>CITY</th>
                    <th>STATE</th>
                    <th>CATEGORY</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedMerchants.length > 0 ? (
                    paginatedMerchants.map((m, idx) => (
                      <tr key={idx}>
                        <td>{m.merchantId}</td>
                        <td>{m.shopName}</td>
                        <td>{m.contactName}</td>
                        <td>{m.mobileNumber}</td>
                        <td>{m.email}</td>
                        <td>{m.city}</td>
                        <td>{m.state}</td>
                        <td>{m.category}</td>
                        <td className="table-content">
                          <div className="flex gap-2">
                            <button
                              className="header-icon-box"
                              onClick={() => setSelectedMerchant(m)}
                            >
                              <EyeIcon className="primary-color w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="9"
                        className="text-center py-4 text-gray-500"
                      >
                        No Merchants found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
}
