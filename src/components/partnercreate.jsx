import {
  Building2,
  Eye,
  File,
  FileText,
  Search,
  SquarePen,
  Save,
  SaveAll,
  EyeClosed,
  EyeOff,
  ArrowLeft,
  RotateCcw,
  Check,
  CalculatorIcon,
  X,
  Lock,
  SaveIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Select from "react-select";
import usePublicIp from "../hooks/usePublicIp";
import "../styles/styles.css";
import {
  transformConstraints,
  toggleAllowed,
  buildMetadata,
  buildRequestInfo,
  prepareDocuments,
} from "../utils/constraintParser";
// import { PencilIcon, Plus,SquarePen  } from "lucide-react";

export default function Partnercreate() {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [formOpen, setformOpen] = useState(false);
  const [agreementFile, setAgreementFile] = useState(null);
  const [idFile, setIdFile] = useState(null);
  const [addressFile, setAddressFile] = useState(null);
  const [partners, setPartners] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const partnersPerPage = 5;
  const [products, setProducts] = useState([]); // fetched products
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [portalOptions, setPortalOptions] = useState([]);
  const [removedImages, setRemovedImages] = useState({
    agreementDocument: null,
    idProofDocument: null,
    addressProofDocument: null,
  });

  const [modalImage, setModalImage] = useState(null);
  const [constraints, setConstraints] = useState([]);

  const handleRemoveImage = (type) => {
    setRemovedImages((prev) => ({
      ...prev,
      [type]: form[type], // Save the image before removing
    }));

    setForm((prev) => ({
      ...prev,
      [type]: null, // Remove the image from form state
    }));
  };

  const handleUndoImage = (type) => {
    setForm((prev) => ({
      ...prev,
      [type]: removedImages[type], // Restore the removed image
    }));

    setRemovedImages((prev) => ({
      ...prev,
      [type]: null, // Clear the removed image state
    }));
  };
  const handleFileChange = (file, type) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(",")[1];
      setForm((prev) => ({ ...prev, [type]: base64 }));
    };
    reader.readAsDataURL(file);
  };
  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]); // strip "data:...base64,"
      reader.onerror = (error) => reject(error);
    });
  };
  const reverseBase64String = (base64String) => {
    if (!base64String) return "";
    try {
      const binaryString = atob(base64String);
      const reversed = binaryString.split("").reverse().join("");
      return btoa(reversed);
    } catch (error) {
      console.error("Error reversing base64 data:", error);
      return base64String;
    }
  };

  const [editingId, setEditingId] = useState(null);
  useEffect(() => {
    fetch(`${API_BASE_URL}/fes/api/Export/product_Config_export`)
      .then((res) => res.json())
      .then((data) => {
        // 🔹 Remove duplicates by productName
        const unique = Array.from(
          new Map(data.map((item) => [item.productName, item])).values()
        );
        setProducts(unique);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  useEffect(() => {
    const fetchConstraints = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/fes/api/Export/constraints-disturbution-parnter`
        );
        setConstraints(transformConstraints(res.data)); // ✅ Use function
      } catch (err) {
        console.error("Error fetching constraints", err);
      }
    };

    fetchConstraints();

    const fetchPortalUrls = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/fes/api/Export/partner-url`
        );
        setPortalOptions(res.data || []);
      } catch (err) {
        console.error("Error fetching portal URLs:", err);
      }
    };
    fetchPortalUrls();
  }, []);

  const ip = usePublicIp();
  // Fetch API data
  useEffect(() => {
    fetchConfigurations();
  }, []);
  const fetchConfigurations = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/fes/api/Export/partner_summary_export`
      );
      setPartners(res.data);
    } catch (err) {
      console.error("Error fetching configurations:", err);
    }
  };
  // Filter by search
  const filteredPartners = partners
    .filter((p) => p.partnerName) // only keep items with partnerName
    .filter((p) => p.partnerName.toLowerCase().includes(search.toLowerCase()));

  // Pagination logic
  const totalPages = Math.ceil(filteredPartners.length / partnersPerPage);
  const indexOfLast = currentPage * partnersPerPage;
  const indexOfFirst = indexOfLast - partnersPerPage;
  const currentPartners = filteredPartners.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const toggleAllowed = (product) => {
    const current = form.allowedProducts || []; // fallback to []
    if (current.includes(product)) {
      setForm({
        ...form,
        allowedProducts: current.filter((p) => p !== product),
      });
    } else {
      setForm({
        ...form,
        allowedProducts: [...current, product],
      });
    }
  };

  // Default form values with all required keys
  const defaultFormValues = {
    partnerName: "",
    productName: 0,
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    city: "",
    state: "",
    pincode: 0,
    partnerType: "Retailer",
    partnerStatus: "Active",
    kycLevel: "Basic",
    kycStatus: "Verified",
    riskProfile: "Low",
    revenueShareModel: "",
    panNumber: "",
    tanNumber: "",
    gstin: "",
    cardIssuanceCommissionPercent: 0,
    transactionCommissionPercent: 0,
    monthlyFixedFee: 0,
    commissionCurrency: "INR",
    settlementFrequency: "monthly",
    allowedProducts: [],
    portalUrl: "",
    webhookUrl: "default",
    agreementDocument: "",
    idProofDocument: "",
    addressProofDocument: "",
    commissionConfig: "",
    status: 1,
    createdBy: "admin-user",
    kycSubmittedAt: new Date().toISOString(),
    kycVerifiedAt: new Date().toISOString(),
    kycVerifiedBy: "system",
  };

  // Form state
  const [form, setForm] = useState({ ...defaultFormValues });
  // ✅ Keys allowed in backend schema
  const schemaKeys = [
    "partnerName",
    "partnerType",
    "contactName",
    "contactEmail",
    "contactPhone",
    "partnerStatus",
    "portalAccessEnabled",
    "portalUrl",
    "kycStatus",
    "kycLevel",
    "panNumber",
    "tanNumber",
    "gstin",
    "address",
    "pincode",
    "state",
    "city",
    "riskProfile",
    "allowedProducts",
    "cardIssuanceCommissionPercent",
    "transactionCommissionPercent",
    "monthlyFixedFee",
    "commissionCurrency",
    "settlementFrequency",
    "status",
    "agreementDocument",
    "idProofDocument",
    "addressProofDocument",
    "createdBy",
    "metadata",
    "requestInfo",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let payload = {
        ...form,
        pincode: Number(form.pincode) || 0,
        cardIssuanceCommissionPercent:
          Number(form.cardIssuanceCommissionPercent) || 0,
        transactionCommissionPercent:
          Number(form.transactionCommissionPercent) || 0,
        monthlyFixedFee: Number(form.monthlyFixedFee) || 0,
        allowedProducts: Array.isArray(form.allowedProducts)
          ? form.allowedProducts.join(",")
          : "",
        portalUrl: form.portalAccessEnabled ? form.portalUrl : 0,
        // agreementDocument: agreementFile ? await toBase64(agreementFile) : "",
        // idProofDocument: idFile ? await toBase64(idFile) : "",
        // addressProofDocument: addressFile ? await toBase64(addressFile) : "",
        metadata: buildMetadata("admin-user"),
        requestInfo: buildRequestInfo(ip, "admin-user"),
        createdBy: "admin-user",
      };
      if (agreementFile) {
        payload.agreementDocument = await toBase64(agreementFile);
      }
      if (idFile) {
        payload.idProofDocument = await toBase64(idFile);
      }
      if (addressFile) {
        payload.addressProofDocument = await toBase64(addressFile);
      }

      // Only keep allowed keys as per schema
      payload = Object.fromEntries(
        Object.entries(payload).filter(([key]) => schemaKeys.includes(key))
      );

      // Determine method and URL
      const isEditing = !!editingId; // true if editing
      const method = isEditing ? "put" : "post";
      const url = isEditing
        ? `${API_BASE_URL}/ps/DistributionPartner-Update`
        : `${API_BASE_URL}/ps/DistributionPartner-Create`;

      // console.log("Submitting partner form");
      // console.log("Editing mode:", isEditing);
      // console.log("URL:", url);
      // console.log("Payload:", payload);

      const res = await axios({
        method: method,
        url: url,
        data: payload,
        headers: { "Content-Type": "application/json" },
      });

      alert(
        isEditing
          ? "Partner updated successfully!"
          : "Partner created successfully!"
      );

      // Reset the form
      setForm({ ...defaultFormValues });
      setAgreementFile(null);
      setIdFile(null);
      setAddressFile(null);
      setformOpen(false);
      setIsEditing(false);
      setEditingId(null);

      // Refresh the partner list
      await fetchConfigurations();
    } catch (error) {
      console.error(
        "Error creating/updating partner:",
        error.response || error
      );
      alert("Error: " + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (partnerName, partnerType) => {
    const partner = partners.find(
      (p) => p.partnerName === partnerName && p.partnerType === partnerType
    );
    if (!partner) {
      alert("Partner not found!");
      return;
    }

    setForm({
      ...partner,
      portalUrl: partner.portalUrl || 0,
      allowedProducts: partner.allowedProducts
        ? partner.allowedProducts.split(",")
        : [],
      agreementDocumentReversed: reverseBase64String(
        partner.agreementDocumentBase64
      ),
      idProofDocumentReversed: reverseBase64String(
        partner.idProofDocumentBase64
      ),
      addressProofDocumentReversed: reverseBase64String(
        partner.addressProofDocumentBase64
      ),
    });
    setAgreementFile(null);
    setIdFile(null);
    setAddressFile(null);

    // Create a composite editingId for tracking state
    setEditingId(`${partner.partnerName}-${partner.partnerType}`);
    setIsEditing(true);
    setformOpen(true);
  };

  const getConstraintOptions = (constraints, title) => {
    return constraints.find((c) => c.title === title)?.options || [];
  };

  const options = products.map((product) => ({
    value: product.productName,
    label: product.productName,
  }));

  // Handle change
  const handleChanges = (selected) => {
    setForm({
      ...form,
      allowedProducts: selected ? selected.map((s) => s.value) : [],
    });
  };

  // Custom styles to match your theme
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#11161a", // 🔹 transparent bg
      border: state.isFocused
        ? "2px solid rgba(0, 245, 160, 0.7)" // ✅ apply full border when focused
        : "1px solid rgb(153 255 217 / 40%)",
      borderRadius: "8px",
      minHeight: "32px",
      boxShadow: "0 0 10px #00f5a022", // 🔹 default shadow
      "&:hover": {
        // borderColor: "#14b8a6",
        // boxShadow: "0 0 8px rgba(20, 184, 166, 0.8)", // stronger shadow on hover
      },
      ...(state.isFocused && {
        borderColor: "rgba(0, 245, 160, 0.7)",
      }),
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "2px 8px",
      color: "#d1d5db",
      fontSize: "13px",
    }),
    multiValue: (provided) => ({
      ...provided,
      borderRadius: "6px",
      backgroundColor: "rgba(20, 184, 166, 0.15)", // keep tags visible
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#d1d5db",
      fontSize: "13px",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#14b8a6",
      // ":hover": {
      //   backgroundColor: "#14b8a6",
      //   color: "white",
      // },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#0f1114",
      border: "1px solid rgba(20, 184, 166, 0.5)",
      borderRadius: "10px",
      zIndex: 10,
      maxHeight: "240px", // like max-h-60
      overflowY: "auto",
      scrollbarWidth: "none", // Firefox
      msOverflowStyle: "none", // IE/Edge
      "&::-webkit-scrollbar": {
        display: "none", // Chrome, Safari
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#1452A8"
        : state.isFocused
        ? "#1452A8"
        : "transparent", // 🔹 transparent instead of solid
      color: "#fff",
      fontSize: "12px",
      cursor: "pointer",
      ":hover": {
        backgroundColor: "#1452A8",
      },
      ":active": {
        backgroundColor: "#14b8a6",
        color: "white",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#fff",
      fontSize: "12px",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#d1d5db",
      fontSize: "13px",
    }),
  };

  return (
    <div className="config-forms">
      {/* Header */}
      <div className="card-header flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 p-2 sm:p-4">
  {/* Left Section */}
  <div className="card-header-left flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2">
    <div className="flex items-center gap-2">
      <div className="header-icon-box bg-gray-800 p-2 rounded">
        <CalculatorIcon className="text-[#00d4aa] w-4 h-4" />
      </div>
    </div>
    <div>
      <h1 className="header-title text-sm sm:text-lg font-semibold text-center sm:text-left">
        Distribution Partner Management
      </h1>
      <p className="header-subtext text-xs sm:text-sm text-gray-400 text-center sm:text-left">
        Onboard and manage distribution partners
      </p>
    </div>
  </div>

  {/* Right Section */}
  <div className="card-header-right flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
    <button
      className="btn-outline flex items-center gap-1 w-full sm:w-auto justify-center text-xs sm:text-sm"
      onClick={() => setformOpen((prev) => !prev)}
    >
      {formOpen ? (
        <>
          <EyeOff className="w-4 h-4" />
          Hide Form
        </>
      ) : (
        <>
          <Eye className="w-4 h-4" />
          Show Form
        </>
      )}
    </button>

    <div className="portal-info text-center sm:text-left">
      <p className="portal-label text-gray-400 text-xs sm:text-sm">Content Creation</p>
      <p className="portal-link text-teal-500 text-xs sm:text-sm font-medium text-center sm:text-right">Maker Portal</p>
    </div>
  </div>
</div>


      {formOpen && (
        <form className="department-form mt-[18px]" onSubmit={handleSubmit}>
          <div className="page-header">
            <h2 className="form-title flex ">
              <CalculatorIcon className="text-[#00d4aa] w-5 h-5 mr-[10px]" />
              Create Partner Configuration
            </h2>
          </div>
          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
  {/* Partner Name */}
  <div className="form-group flex flex-col">
    <label className="text-sm sm:text-base mb-1">Partner Name</label>
    <input
      type="text"
      name="partnerName"
      className="form-input p-2 border border-gray-700 rounded text-sm sm:text-base"
      placeholder="Enter partner name"
      value={form.partnerName}
      onChange={handleChange}
    />
  </div>

  {/* Contact Name */}
  <div className="form-group flex flex-col">
    <label className="text-sm sm:text-base mb-1">Contact Name</label>
    <input
      type="text"
      name="contactName"
      className="form-input p-2 border border-gray-700 rounded text-sm sm:text-base"
      placeholder="Enter contact name"
      value={form.contactName}
      onChange={handleChange}
    />
  </div>

  {/* Contact Email */}
  <div className="form-group flex flex-col">
    <label className="text-sm sm:text-base mb-1">Contact Email</label>
    <input
      type="email"
      name="contactEmail"
      className="form-input p-2 border border-gray-700 rounded text-sm sm:text-base"
      placeholder="Enter contact email"
      value={form.contactEmail}
      onChange={handleChange}
    />
  </div>

  {/* Contact Phone */}
  <div className="form-group flex flex-col">
    <label className="text-sm sm:text-base mb-1">Contact Phone</label>
    <input
      type="text"
      name="contactPhone"
      className="form-input p-2 border border-gray-700 rounded text-sm sm:text-base"
      placeholder="Enter contact phone"
      value={form.contactPhone}
      onChange={handleChange}
    />
  </div>

  {/* Address */}
  <div className="form-group flex flex-col">
    <label className="text-sm sm:text-base mb-1">Address</label>
    <input
      type="text"
      name="address"
      className="form-input p-2 border border-gray-700 rounded text-sm sm:text-base"
      placeholder="Enter address"
      value={form.address}
      onChange={handleChange}
    />
  </div>

  {/* City */}
  <div className="form-group flex flex-col">
    <label className="text-sm sm:text-base mb-1">City</label>
    <input
      type="text"
      name="city"
      className="form-input p-2 border border-gray-700 rounded text-sm sm:text-base"
      placeholder="Enter city"
      value={form.city}
      onChange={handleChange}
    />
  </div>

  {/* State */}
  <div className="form-group flex flex-col">
    <label className="text-sm sm:text-base mb-1">State</label>
    <input
      type="text"
      name="state"
      className="form-input p-2 border border-gray-700 rounded text-sm sm:text-base"
      placeholder="Enter state"
      value={form.state}
      onChange={handleChange}
    />
  </div>

  {/* Pincode */}
  <div className="form-group flex flex-col">
    <label className="text-sm sm:text-base mb-1">Pincode</label>
    <input
      type="text"
      name="pincode"
      maxLength={6}
      className="form-input p-2 border border-gray-700 rounded text-sm sm:text-base"
      placeholder="Enter pincode"
      value={form.pincode}
      onChange={handleChange}
    />
  </div>

  {/* Partner Type */}
  <div className="form-group flex flex-col">
    <label className="text-sm sm:text-base mb-1">Partner Type</label>
    <select
      name="partnerType"
      value={form.partnerType}
      onChange={handleChange}
      className="form-input p-2 border border-gray-700 rounded text-sm sm:text-base"
    >
      <option value="">Select partner type</option>
      <option value="Retailer">Retailer</option>
      <option value="Aggregator">Aggregator</option>
      <option value="Bank">Bank</option>
      <option value="Fintech">Fintech</option>
      <option value="Distributor">Distributor</option>
      <option value="SuperDistributor">Super Distributor</option>
      <option value="Corporate">Corporate</option>
      <option value="Agent">Agent</option>
      <option value="Franchise">Franchise</option>
    </select>
  </div>

  {/* Partner Status */}
  <div className="form-group flex flex-col">
    <label className="text-sm sm:text-base mb-1">Partner Status</label>
    <select
      name="partnerStatus"
      value={form.partnerStatus}
      onChange={handleChange}
      className="form-input p-2 border border-gray-700 rounded text-sm sm:text-base"
    >
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>
  </div>
</div>

          <div className="mt-8 relative w-full sm:w-1/2">
  <h3 className="section-title text-sm sm:text-base mb-2">Allowed Products</h3>

  {/* Dropdown Toggle */}
  {/* <button
    type="button"
    onClick={() => setShowProductDropdown(!showProductDropdown)}
    className="w-full mt-2 px-3 py-1 bg-[#0d1220] border border-teal-700/50 rounded-[8px] text-left text-gray-300 text-[13px]"
  >
    {form.allowedProducts.length > 0
      ? form.allowedProducts.join(", ")
      : "Select Products"}
  </button> */}

  {/* Dropdown Menu */}
  {/* {showProductDropdown && (
    <div className="absolute mt-0 w-full bg-[#0d1220] border border-teal-700/50 rounded-[10px] shadow-lg z-10 max-h-60 overflow-y-auto">
      {products.map((product) => {
        const checked = form.allowedProducts?.includes(
          product.productName
        );
        return (
          <label
            key={product.productId}
            className="flex items-center gap-2 px-3 py-2 hover:bg-[#1c2b45] cursor-pointer text-gray-300"
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggleAllowed(product.productName)}
              className="accent-teal-500"
            />
            <span className="text-sm">{product.productName}</span>
          </label>
        );
      })}
    </div>
  )} */}

  {/* Multi Select */}
  <div className="mt-2">
    <Select
      isMulti
      closeMenuOnSelect={false}
      options={options}
      value={options.filter((opt) =>
        form.allowedProducts.includes(opt.value)
      )}
      onChange={handleChanges}
      styles={customStyles}
      placeholder="Select Products"
      maxMenuHeight={200}
      className="w-full"
    />
  </div>
</div>


         <div className="portal-access flex flex-col sm:flex-row sm:items-center gap-2 text-gray-300 w-full">
  {/* Status Dot */}
  <div className="status-dot"></div>

  {/* Custom Checkbox */}
  <div
    onClick={() =>
      setForm((prev) => ({
        ...prev,
        portalAccessEnabled: !prev.portalAccessEnabled,
      }))
    }
    className={`w-4 h-4 flex items-center justify-center border rounded-sm cursor-pointer
      ${
        form.portalAccessEnabled
          ? "bg-teal-500 border-teal-500"
          : "bg-[#0d1220] border-teal-700/50"
      }
      transition-colors duration-200`}
  >
    {form.portalAccessEnabled && (
      <Check size={14} className="text-[#0d1220]" />
    )}
  </div>

  {/* Label */}
  <span className="text-[12px] sm:text-[13px] w-full sm:w-auto">
    Portal Access Enabled
  </span>

  {/* ✅ Input appears only if checked */}
  {form.portalAccessEnabled && (
    <div className="label-input w-full sm:w-1/2 mt-2 sm:mt-0">
      {/* <input
          name="portalUrl"
          value={form.portalUrl}
          onChange={handleChange}
          className="form-input"
          type="text"
          placeholder="Enter portal details"
      /> */}

      <select
        name="portalUrl"
        value={form.portalUrl}
        onChange={(e) =>
          setForm({ ...form, portalUrl: Number(e.target.value) })
        }
        disabled={!form.portalAccessEnabled}
        className="form-select w-full sm:w-full"
      >
        <option value="">-- Select Portal URL --</option>
        {portalOptions.map((p) => (
          <option key={p.portalId} value={p.portalId}>
            {p.portalUrl}
          </option>
        ))}
      </select>
    </div>
  )}
</div>


     <div className="documents-section mt-8 w-full">
  <h3 className="section-title text-teal-400 text-lg sm:text-xl mb-4 text-left">
    Documents
  </h3>

  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4 w-full">
    {/* Agreement Document */}
    <div className="relative w-full flex flex-col items-center sm:items-start text-center sm:text-left">
      <label className="text-[#00d4aa] text-[14px] sm:text-[15px]">
        Agreement Document
      </label>
      <p className="text-[10px] text-gray-400">(PDF/JPG/PNG, Max 5MB)</p>

      {form.agreementDocument ? (
        <div className="mt-2 relative group">
          <img
            src={`data:image/png;base64,${form.agreementDocument}`}
            alt="Agreement Document Preview"
            className="max-w-full sm:max-w-[100px] cursor-pointer border border-gray-300 mx-auto sm:mx-0"
            onClick={() =>
              setModalImage(`data:image/png;base64,${form.agreementDocument}`)
            }
          />
          <button
            onClick={() => handleRemoveImage("agreementDocument")}
            className="absolute top-1 right-1 bg-red-600 text-white rounded px-2 py-0.5 text-xs opacity-0 group-hover:opacity-100 transition"
          >
            Edit
          </button>
        </div>
      ) : (
        <div className="mt-2 space-y-2 w-full flex flex-col items-center sm:items-start text-center sm:text-left">
          {removedImages.agreementDocument && (
            <button
              onClick={() => handleUndoImage("agreementDocument")}
              className="bg-yellow-500 text-white rounded px-3 py-1 text-xs"
            >
              Undo
            </button>
          )}
          <div className="file-upload flex flex-col items-center sm:items-start gap-2">
            <label className="choose-btn cursor-pointer bg-gray-800 text-white px-3 py-1 rounded">
              Choose File
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setAgreementFile(file);
                  handleFileChange(file, "agreementDocument");
                }}
              />
            </label>
            <span className="file-name text-sm text-gray-300 truncate max-w-[150px] sm:max-w-full">
              {agreementFile ? agreementFile.name : "No file chosen"}
            </span>
          </div>
        </div>
      )}
    </div>

    {/* ID Proof Document */}
    <div className="relative w-full flex flex-col items-center sm:items-start text-center sm:text-left">
      <label className="text-[#00d4aa] text-[14px] sm:text-[15px]">
        ID Proof Document
      </label>
      <p className="text-[10px] text-gray-400">(PDF/JPG/PNG, Max 2MB)</p>

      {form.idProofDocument ? (
        <div className="mt-2 relative group">
          <img
            src={`data:image/png;base64,${form.idProofDocument}`}
            alt="ID Proof Document Preview"
            className="max-w-full sm:max-w-[100px] cursor-pointer border border-gray-300 mx-auto sm:mx-0"
            onClick={() =>
              setModalImage(`data:image/png;base64,${form.idProofDocument}`)
            }
          />
          <button
            onClick={() => handleRemoveImage("idProofDocument")}
            className="absolute top-1 right-1 bg-red-600 text-white rounded px-2 py-0.5 text-xs opacity-0 group-hover:opacity-100 transition"
          >
            Edit
          </button>
        </div>
      ) : (
        <div className="mt-2 space-y-2 w-full flex flex-col items-center sm:items-start text-center sm:text-left">
          {removedImages.idProofDocument && (
            <button
              onClick={() => handleUndoImage("idProofDocument")}
              className="bg-yellow-500 text-white rounded px-3 py-1 text-xs"
            >
              Undo
            </button>
          )}
          <div className="file-upload flex flex-col items-center sm:items-start gap-2">
            <label className="choose-btn cursor-pointer bg-gray-800 text-white px-3 py-1 rounded">
              Choose File
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setIdFile(file);
                  handleFileChange(file, "idProofDocument");
                }}
              />
            </label>
            <span className="file-name text-sm text-gray-300 truncate max-w-[150px] sm:max-w-full">
              {idFile ? idFile.name : "No file chosen"}
            </span>
          </div>
        </div>
      )}
    </div>

    {/* Address Proof Document */}
    <div className="relative w-full flex flex-col items-center sm:items-start text-center sm:text-left">
      <label className="text-[#00d4aa] text-[14px] sm:text-[15px]">
        Address Proof Document
      </label>
      <p className="text-[10px] text-gray-400">(PDF/JPG/PNG, Max 2MB)</p>

      {form.addressProofDocument ? (
        <div className="mt-2 relative group">
          <img
            src={`data:image/png;base64,${form.addressProofDocument}`}
            alt="Address Proof Document Preview"
            className="max-w-full sm:max-w-[100px] cursor-pointer border border-gray-300 mx-auto sm:mx-0"
            onClick={() =>
              setModalImage(`data:image/png;base64,${form.addressProofDocument}`)
            }
          />
          <button
            onClick={() => handleRemoveImage("addressProofDocument")}
            className="absolute top-1 right-1 bg-red-600 text-white rounded px-2 py-0.5 text-xs opacity-0 group-hover:opacity-100 transition"
          >
            Edit
          </button>
        </div>
      ) : (
        <div className="mt-2 space-y-2 w-full flex flex-col items-center sm:items-start text-center sm:text-left">
          {removedImages.addressProofDocument && (
            <button
              onClick={() => handleUndoImage("addressProofDocument")}
              className="bg-yellow-500 text-white rounded px-3 py-1 text-xs"
            >
              Undo
            </button>
          )}
          <div className="file-upload flex flex-col items-center sm:items-start gap-2">
            <label className="choose-btn cursor-pointer bg-gray-800 text-white px-3 py-1 rounded">
              Choose File
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setAddressFile(file);
                  handleFileChange(file, "addressProofDocument");
                }}
              />
            </label>
            <span className="file-name text-sm text-gray-300 truncate max-w-[150px] sm:max-w-full">
              {addressFile ? addressFile.name : "No file chosen"}
            </span>
          </div>
        </div>
      )}
    </div>

    {/* Modal Preview */}
    {modalImage && (
      <div
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
        onClick={() => setModalImage(null)}
      >
        <img src={modalImage} alt="Zoomed Document" className="max-w-full max-h-full" />
      </div>
    )}
  </div>
</div>


          {/* Advanced Configuration Section */}
          <div className="advanced-config mt-10 w-full">
  <h3 className="section-title text-[#00d4aa] text-lg sm:text-xl mb-4">
    Advanced Configuration
  </h3>

  {/* Compliance & KYC */}
  <div className="mt-6">
    <h4 className="text-sm sm:text-base font-semibold text-[#00d4aa] mb-4">
      Compliance & KYC
    </h4>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="form-group w-full">
        <label className="text-sm sm:text-base">KYC Level</label>
        <select
          name="kycLevel"
          value={form.kycLevel || ""}
          onChange={handleChange}
          className="form-input w-full"
        >
          <option value="">-- Select Status --</option>
          {getConstraintOptions(constraints, "distribution_partner_kyc_level_check")?.map(
            (opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            )
          )}
        </select>
      </div>

      <div className="form-group w-full">
        <label className="text-sm sm:text-base">KYC Status</label>
        <select
          name="kycStatus"
          value={form.kycStatus || ""}
          onChange={handleChange}
          className="form-input w-full"
        >
          <option value="">-- Select Status --</option>
          {getConstraintOptions(constraints, "distribution_partner_kyc_status_check")?.map(
            (opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            )
          )}
        </select>
      </div>

      <div className="form-group w-full">
        <label className="text-sm sm:text-base">Partner Status</label>
        <select
          name="partnerStatus"
          value={form.partnerStatus || ""}
          onChange={handleChange}
          className="form-input w-full"
        >
          <option value="">-- Select Status --</option>
          {getConstraintOptions(constraints, "distribution_partner_status_check")?.map(
            (opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            )
          )}
        </select>
      </div>

      <div className="form-group w-full">
        <label className="text-sm sm:text-base">Risk Profile</label>
        <select
          name="riskProfile"
          value={form.riskProfile || ""}
          onChange={handleChange}
          className="form-input w-full"
        >
          <option value="">-- Select Status --</option>
          {getConstraintOptions(constraints, "distribution_partner_risk_profile_check")?.map(
            (opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            )
          )}
        </select>
      </div>

      <div className="form-group w-full">
        <label className="text-sm sm:text-base">PAN Number</label>
        <input
          type="text"
          name="panNumber"
          className="form-input w-full"
          placeholder="Enter PAN number"
          value={form.panNumber || ""}
          onChange={handleChange}
          maxLength={10}
        />
      </div>

      <div className="form-group w-full">
        <label className="text-sm sm:text-base">TAN Number</label>
        <input
          type="text"
          name="tanNumber"
          className="form-input w-full"
          placeholder="Enter TAN number"
          value={form.tanNumber || ""}
          onChange={handleChange}
          maxLength={10}
        />
      </div>

      <div className="form-group w-full">
        <label className="text-sm sm:text-base">GSTIN</label>
        <input
          type="text"
          name="gstin"
          className="form-input w-full"
          placeholder="Enter GSTIN"
          value={form.gstin || ""}
          onChange={handleChange}
          maxLength={15}
        />
      </div>
    </div>
  </div>

  {/* Financial Configuration */}
  <div className="mt-8">
    <h4 className="text-sm sm:text-base font-semibold text-[#00d4aa] mb-4">
      Financial Configuration
    </h4>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="form-group w-full">
        <label className="text-sm sm:text-base">Card Issuance Commission %</label>
        <input
          type="number"
          name="cardIssuanceCommissionPercent"
          className="form-input w-full"
          placeholder="0"
          value={form.cardIssuanceCommissionPercent || ""}
          min="0"
          max="100"
          onChange={handleChange}
          onInput={(e) => {
            if (e.target.value > 100) e.target.value = 100;
          }}
        />
      </div>

      <div className="form-group w-full">
        <label className="text-sm sm:text-base">Transaction Commission %</label>
        <input
          type="number"
          name="transactionCommissionPercent"
          className="form-input w-full"
          placeholder="0"
          value={form.transactionCommissionPercent || ""}
          min="0"
          max="100"
          onChange={handleChange}
          onInput={(e) => {
            if (e.target.value > 100) e.target.value = 100;
          }}
        />
      </div>

      <div className="form-group w-full">
        <label className="text-sm sm:text-base">Monthly Fixed Fee</label>
        <input
          type="number"
          name="monthlyFixedFee"
          className="form-input w-full"
          placeholder="0"
          value={form.monthlyFixedFee || ""}
          onChange={handleChange}
        />
      </div>

      <div className="form-group w-full">
        <label className="text-sm sm:text-base">Commission Currency</label>
        <select
          name="commissionCurrency"
          className="form-input w-full"
          value={form.commissionCurrency || "INR"}
          onChange={handleChange}
        >
          <option value="INR">INR</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
      </div>

      <div className="form-group w-full">
        <label className="text-sm sm:text-base">Settlement Frequency</label>
        <select
          name="settlementFrequency"
          className="form-input w-full"
          value={form.settlementFrequency || "monthly"}
          onChange={handleChange}
        >
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
          <option value="daily">Daily</option>
        </select>
      </div>
    </div>
  </div>
</div>


       <div className="form-footer flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mt-6 w-full">
  {/* Back Button */}
  <button
    type="button"
    className="btn-outline-back w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 px-4 py-2 text-sm sm:text-base"
    onClick={() => setformOpen(false)}
  >
    <ArrowLeft className="icon w-4 h-4 sm:w-5 sm:h-5" /> Back
  </button>

  {/* Right Buttons */}
  <div className="footer-right flex flex-col sm:flex-row gap-3 sm:gap-2 w-full sm:w-auto">
    <button
      type="button"
      className="btn-outline-reset w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-sm sm:text-base"
      onClick={() => {
        setEditingId(null);
        setIsEditing(false);
        setForm({ ...defaultFormValues });
      }}
    >
      <RotateCcw className="icon w-4 h-4 sm:w-5 sm:h-5" /> Reset
    </button>
    <button
      type="submit"
      className="btn-outline-reset w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-sm sm:text-base"
    >
      <Save className="icon w-4 h-4 sm:w-5 sm:h-5" />
      {editingId ? "Update partner" : "Create partner"}
    </button>
  </div>
</div>

        </form>
      )}
      <div className="partner-network">
        <div className="table-card">
          {/* Header */}
          <div className="table-header flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4 px-2 sm:px-0">
  {/* Title */}
  <p className="table-title flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-200">
    <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#00d4aa]" />
    Existing Partner Configurations
  </p>

  {/* Search bar */}
  <div className="search-box relative w-full sm:w-64">
    <Search className="absolute left-3 top-2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
    <input
      type="text"
      className="search-input !w-full pl-8 pr-2 py-1 sm:py-2 text-xs sm:text-sm rounded border border-gray-700 bg-[#0d0f13] text-gray-200 focus:outline-none focus:border-teal-400"
      placeholder="Search partners..."
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
      }}
    />
  </div>
</div>


          {/* Table */}
          <div className="table-wrapper overflow-x-auto table-scrollbar">
  <table className="w-full text-sm text-left min-w-[800px]">
    <thead className="table-head bg-gray-800 text-gray-200">
      <tr>
        <th className="table-cell px-3 py-2">Partner Name</th>
        <th className="table-cell px-3 py-2">Type</th>
        <th className="table-cell px-3 py-2">Contact</th>
        <th className="table-cell px-3 py-2">Status</th>
        <th className="table-cell px-3 py-2">KYC Status</th>
        <th className="table-cell px-3 py-2">Agreement</th>
        <th className="table-cell px-3 py-2">ID Proof</th>
        <th className="table-cell px-3 py-2">Address Proof</th>
        <th className="table-cell px-3 py-2">Action</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-700">
      {currentPartners.map((partner, index) => (
        <tr key={index} className="table-row hover:bg-gray-900">
          <td className="table-cell px-3 py-2 max-w-[120px] truncate" title={partner.partnerName}>
            {partner.partnerName}
          </td>
          <td className="px-3 py-2">{partner.partnerType}</td>
          <td className="px-3 py-2 max-w-[120px] truncate" title={`${partner.contactName} ${partner.contactPhone}`}>
            {partner.contactName} {partner.contactPhone}
          </td>
          <td className="px-3 py-2">
            <span
              className={`px-2 py-1 rounded text-[10px] ${
                partner.partnerStatus === "Active"
                  ? "checker"
                  : partner.partnerStatus === "Onboarded"
                  ? "maker"
                  : partner.partnerStatus === "Inactive"
                  ? "superuser"
                  : ""
              }`}
            >
              {partner.partnerStatus}
            </span>
          </td>
          <td className="px-3 py-2">
            <span className={`px-2 py-1 rounded text-[10px] ${partner.kycStatus === "Verified" ? "checker" : "superuser"}`}>
              {partner.kycStatus}
            </span>
          </td>
          <td className="px-3 py-2">
            {partner.agreementDocumentBase64 ? (
              <span className="px-2 py-1 rounded text-[10px] checker">Completed</span>
            ) : (
              <span className="px-2 py-1 rounded text-[10px] infra">Pending</span>
            )}
          </td>
          <td className="px-3 py-2">
            {partner.idProofDocumentBase64 ? (
              <span className="px-2 py-1 rounded text-[10px] checker">Verified</span>
            ) : (
              <span className="px-2 py-1 rounded text-[10px] infra">Pending</span>
            )}
          </td>
          <td className="px-3 py-2">
            {partner.addressProofDocumentBase64 ? (
              <span className="px-2 py-1 rounded text-[10px] checker">Verified</span>
            ) : (
              <span className="px-2 py-1 rounded text-[10px] infra">Pending</span>
            )}
          </td>
          <td className="px-3 py-2">
            <button
              className="header-icon-box"
              onClick={() => handleEdit(partner.partnerName, partner.partnerType)}
            >
              <SquarePen className="text-[#00d4aa] w-4 h-4" />
            </button>
          </td>
        </tr>
      ))}

      {currentPartners.length === 0 && (
        <tr>
          <td colSpan="9" className="text-center py-4 text-gray-500">
            No partners found.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>


          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 px-2 sm:px-4 gap-2 sm:gap-0">
  {/* Previous Button */}
  <button
    onClick={() => handlePageChange(currentPage - 1)}
    disabled={currentPage === 1}
    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs sm:text-sm ${
      currentPage === 1
        ? "bg-[#1c2b45] text-gray-500 cursor-not-allowed"
        : "bg-[#0a1625] text-white hover:text-[#00d4aa]"
    }`}
  >
    <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" /> Prev
  </button>

  {/* Page Numbers */}
  <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
    {Array.from({ length: totalPages }, (_, i) => (
      <button
        key={i}
        onClick={() => handlePageChange(i + 1)}
        className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm ${
          currentPage === i + 1
            ? "bg-[#00d4aa] text-black font-bold"
            : "bg-[#1c2b45] text-white hover:text-[#00d4aa]"
        }`}
      >
        {i + 1}
      </button>
    ))}
  </div>

  {/* Next Button */}
  <button
    onClick={() => handlePageChange(currentPage + 1)}
    disabled={currentPage === totalPages}
    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs sm:text-sm ${
      currentPage === totalPages
        ? "bg-[#1c2b45] text-gray-500 cursor-not-allowed"
        : "bg-[#0a1625] text-white hover:text-[#00d4aa]"
    }`}
  >
    Next <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
  </button>
</div>

        </div>
      </div>
      {/* Guidelines */}
     <div className="guidelines-card bg-[#0d0f13] p-4 rounded-md border border-gray-800">
  {/* Title */}
  <h3 className="guidelines-title text-lg sm:text-xl font-semibold text-teal-400 mb-4">
    Partner Management Guidelines
  </h3>

  {/* First row */}
  <div className="guidelines-grid grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm sm:text-base text-gray-300">
    <p className="text-xs sm:text-sm text-gray-300">
      🏢 <span className="font-medium text-gray-200">Partner Onboarding:</span> Collect complete business and contact information
    </p>
    <p className="text-xs sm:text-sm text-gray-300">
      📋 <span className="font-medium text-gray-200">Document Verification:</span> Ensure all required documents are uploaded and verified
    </p>
  </div>

  {/* Second row */}
  <div className="guidelines-grid grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-sm sm:text-base text-gray-300">
    <p className="text-xs sm:text-sm text-gray-300">
      🤝 <span className="font-medium text-gray-200">Product Access:</span> Configure allowed products and services for each partner
    </p>
    <p className="text-xs sm:text-sm text-gray-300">
      ✅ <span className="font-medium text-gray-200">Portal Access:</span> Enable partner portal access for self-service capabilities
    </p>
  </div>
</div>

    </div>
  );
}
