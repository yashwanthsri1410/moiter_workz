import React, { useEffect, useState } from "react";
import { ArrowLeft, Building2, Search, Plus } from "lucide-react";
import GuidelinesCard from "./reusable/guidelinesCard";
import { MerchantDiscountRateGuidelines } from "../constants/guidelines";
import customConfirm from "./reusable/CustomConfirm";
import {
  MerchantDiscountRateCreate,
  getMerchantDiscountRateData,
} from "../services/service";
import UseMdrValues from "../hooks/useMdrValues";

export default function MerchantDiscountRateCreation({ onBack }) {
  const { MerchantDiscountRates } = UseMdrValues();
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [mdrType, setMdrType] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [flat, setFlat] = useState("");
  const [percentage, setPercentage] = useState("");

  // Fetch MerchantDiscountRates
  const fetchMerchantDiscountRates = async () => {
    try {
      const res = await getMerchantDiscountRateData();
      setMerchantDiscountRates(res.data || []);
    } catch (err) {
      console.error("Error fetching MerchantDiscountRates:", err);
    }
  };

  useEffect(() => {
    fetchMerchantDiscountRates();
  }, []);

  // Create MerchantDiscountRate
  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirmAction = await customConfirm(
      "Are you sure you want to continue?"
    );
    if (!confirmAction) return;

    try {
      const payload = {
        mdrType,
        minAmount: mdrType === "FLAT" ? Number(minAmount) : null,
        maxAmount: mdrType === "FLAT" ? Number(maxAmount) : null,
        flat: mdrType === "FLAT" ? Number(flat) : null,
        percentage: mdrType === "PERCENTAGE" ? Number(percentage) : null,
        createdBy: "string",
      };
      await MerchantDiscountRateCreate(payload);
      setShowForm(false);
      setPercentage("");
      setFlat("");
      setMaxAmount("");
      setMinAmount("");
      setMdrType("");
      fetchMerchantDiscountRates();
      alert("MerchantDiscountRate Created Sucessfully");
    } catch (err) {
      console.error("Failed to create MerchantDiscountRate:", err);
      alert("Error occurred while creating MerchantDiscountRate.");
    }
  };

  return (
    <>
      {/* Header */}
      <div className="form-header">
        <div className="back-title flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          {/* Top row for mobile: Arrow + Title + Building Icon */}
          <div className="flex items-center justify-between w-full sm:hidden">
            {/* Arrow */}
            <button className="header-icon-btn" onClick={onBack}>
              <ArrowLeft className="primary-color w-4 h-4" />
            </button>

            {/* Title & Subtitle centered */}
            <div className="flex flex-col items-center text-center">
              <h1 className="header-title text-base">
                Merchant Discount Rate Management
              </h1>
              <p className="header-subtext text-xs">
                Create and manage organizational Merchant Discount Rates
              </p>
            </div>

            {/* Building Icon */}
            <div className="header-icon-box">
              <Building2 className="primary-color w-4 h-4" />
            </div>
          </div>

          {/* Active MerchantDiscountRates below for mobile */}
          <div className="flex justify-center w-full sm:hidden mt-2">
            <button className="btn-count text-xs">
              <span className="w-2 h-2 rounded-full bg-[#04CF6A] plus"></span>
              {MerchantDiscountRates.length} Active Merchant Discount Rates
            </button>
          </div>

          {/* Desktop layout (sm and above) */}
          <div className="hidden sm:flex sm:justify-between sm:items-center w-full gap-[10px]">
            {/* Left: Arrow + Building Icon + Title */}
            <div className="header-left flex items-center gap-[10px]">
              <button className="header-icon-btn " onClick={onBack}>
                <ArrowLeft className="primary-color w-4 h-4" />
              </button>
              <div className="header-icon-box">
                <Building2 className="primary-color w-4 h-4" />
              </div>
              <div>
                <h1 className="user-title">
                  Merchant Discount Rate Management
                </h1>
                <p className="user-subtitle">
                  Create and manage organizational Merchant Discount Rates
                </p>
              </div>
            </div>

            {/* Right: Active MerchantDiscountRates */}
            <div className="flex items-center gap-4">
              <button className="btn-count text-sm">
                <span className="w-2 h-2 rounded-full bg-[#04CF6A] plus"></span>
                {MerchantDiscountRates.length} Active Merchant Discount Rates
              </button>
            </div>
          </div>
        </div>

        <div className="search-toggle flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 items-center">
          {/* Search */}
          <div className="search-box relative">
            <Search className="absolute left-3 top-2 text-gray-400 !w-3 h-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Merchant Discount Rates..."
              className="search-input !w-[250px]" // fixed width for all screens
            />
          </div>

          {/* Toggle form */}
          <button
            onClick={() => {
              setShowForm(!showForm), setPercentage("");
              setFlat("");
              setMaxAmount("");
              setMinAmount("");
              setMdrType("");
            }}
            className="btn-toggle flex items-center justify-center align-center gap-1 "
          >
            <Plus className="w-3 h-3" />
            {showForm ? "Close Form" : "Create Merchant Discount Rate"}
          </button>
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="department-form">
          <h2 className="form-title">Create New Merchant Discount Rate</h2>

          <div className="form-group">
            {/* MDR TYPE DROPDOWN */}
            <label className="form-label">MDR Type</label>
            <select
              className="form-input"
              value={mdrType}
              onChange={(e) => setMdrType(e.target.value)}
            >
              <option value="">Select Type</option>
              <option value="FLAT">FLAT</option>
              <option value="PERCENTAGE">PERCENTAGE</option>
            </select>

            {/* FLAT INPUTS */}
            {mdrType === "FLAT" && (
              <div className="mt-4">
                <label className="form-label">Minimum Amount</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Enter minimum amount"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                />

                <label className="form-label mt-3">Maximum Amount</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Enter maximum amount"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                />

                <label className="form-label mt-3">Flat Amount</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Enter flat amount"
                  value={flat}
                  onChange={(e) => setFlat(e.target.value)}
                />
              </div>
            )}

            {/* PERCENTAGE INPUT */}
            {mdrType === "PERCENTAGE" && (
              <div className="mt-4">
                <label className="form-label">Percentage (%)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Enter percentage"
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn-cancel"
            >
              Cancel
            </button>
            <button type="submit" className="btn-toggle">
              Create Merchant Discount Rate
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="table-card">
        <div className="table-header">
          <div className="flex items-center gap-2 primary-color">
            <Building2 className="w-4 h-4" />
            <p className="user-table-header">
              Existing Merchant Discount Rates
            </p>
          </div>
          <span className="table-subtext">
            Total: {MerchantDiscountRates.length} Merchant Discount Rates
          </span>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>MerchantDiscountRate</th>
              </tr>
            </thead>

            <tbody>
              {MerchantDiscountRates.length > 0 ? (
                MerchantDiscountRates.map((mdr) => (
                  <tr key={mdr.mdrId}>
                    <td className="w-full">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-4 h-4 primary-color" />
                        {/* Display MDR Value */}
                        {mdr.displayValue}
                        {/* Optional: show type */}
                        <span className="text-gray-500 text-xs ml-1">
                          ({mdr.mdrType})
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="table-cell table-cell-muted text-center"
                  >
                    No Merchant Discount Rates found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guidelines */}
      <GuidelinesCard
        title="MerchantDiscountRate Management Guidelines"
        guidelines={MerchantDiscountRateGuidelines}
      />
    </>
  );
}
