import { Store, Search, CircleAlert, SquarePen } from "lucide-react";
import { useState, useRef } from "react";
import {
  columns,
  merchants,
  recheckMerchants,
} from "../../constants/merchantForm";

// Sample data (replace with real data or props)

const MerchantList = ({ scrollToTop }) => {
  const [search, setSearch] = useState("");
  const scrollRef = useRef(null);

  const filteredMerchants = merchants.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );
  const editAndSubmit = () => {
    // scrollToTop();
  };

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
            Total: {merchants.length} merchants
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
        {recheckMerchants.length > 0 && (
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
                          onClick={scrollToTop}
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
        )}

        {/* Merchant Table */}
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
                {filteredMerchants.map((m, i) => (
                  <tr key={i} className="border-b hover:bg-muted/5">
                    {columns.map((col) =>
                      col.key !== "status" ? (
                        <td
                          key={col.key}
                          className={`p-2 text-xs ${
                            col.key === "name"
                              ? "font-medium text-chart-5"
                              : "text-[#94a3b8] truncate"
                          }`}
                        >
                          {m[col.key]}
                        </td>
                      ) : (
                        <td key={col.key} className="p-2">
                          <span
                            className={`px-2 py-1 text-xs rounded border ${
                              m.status === "Active"
                                ? "bg-green-500/10 border-green-500/20 text-green-500"
                                : m.status === "Pending"
                                ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-500"
                                : "bg-muted/10 border-white/20 text-[#94a3b8]"
                            }`}
                          >
                            {m.status}
                          </span>
                        </td>
                      )
                    )}
                    <td className="p-2 flex justify-center">
                      {/* <button className="inline-flex items-center justify-center p-1 border rounded-md border-[border-color:#94a3b8] hover:bg-chart-5/10 hover:border-chart-5/50"> */}
                      <SquarePen className="w-4 h-4" />
                      {/* </button> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantList;
