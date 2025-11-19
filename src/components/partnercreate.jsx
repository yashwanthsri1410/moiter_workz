import {
  Eye,
  Search,
  SquarePen,
  Save,
  EyeOff,
  ArrowLeft,
  RotateCcw,
  Check,
  CalculatorIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
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
import { v4 as uuidv4 } from "uuid";
import GuidelinesCard from "./reusable/guidelinesCard";
import { partnerGuidelines } from "../constants/guidelines";
import customConfirm from "./reusable/CustomConfirm";
import {
  createPartner,
  getDashboardData,
  getPartnerData,
  updatePartner,
} from "../services/service";
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
  const [isEditing, setIsEditing] = useState(false);
  const [portalOptions, setPortalOptions] = useState([]);
  const [removedImages, setRemovedImages] = useState({
    agreementDocument: null,
    idProofDocument: null,
    addressProofDocument: null,
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [constraints, setConstraints] = useState([]);
  useEffect(() => {
    // Whenever search term changes, go back to first page
    setCurrentPage(1);
  }, [search]);
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
  const fetchData = async () => {
    const res = await getDashboardData("Export/product_Config_export");
    const res2 = await getDashboardData(
      "Export/constraints-disturbution-parnter"
    );
    const res3 = await getDashboardData("Export/partner-url");
    const data = res?.data;
    const unique = Array.from(
      new Map(data.map((item) => [item.productName, item])).values()
    );
    setProducts(unique);
    setConstraints(transformConstraints(res2?.data));
    setPortalOptions(res3?.data || []);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const ip = usePublicIp();
  // Fetch API data
  useEffect(() => {
    fetchConfigurations();
  }, []);
  const fetchConfigurations = async () => {
    const res = await getPartnerData();
    setPartners(res?.data || []);
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
    logId: uuidv4(),
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
    portalUrl: 0,
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
    password: "",
  };

  // Form state
  const [form, setForm] = useState({ ...defaultFormValues });
  // console.log(form)
  // ✅ Keys allowed in backend schema
  const schemaKeys = [
    "logId",
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
    "password",
    "createdBy",
    "metadata",
    "requestInfo",
    "revenueShareModel",
    "CommissionCurrency ",
    "SettlementFrequency ",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmAction = await customConfirm(
      "Are you sure you want to continue?"
    );
    if (!confirmAction) return;
    try {
      let payload = {
        ...form,
        logId: form.logId || uuidv4(),
        pincode: Number(form.pincode) || 0,
        cardIssuanceCommissionPercent:
          Number(form.cardIssuanceCommissionPercent) || 0,
        transactionCommissionPercent:
          Number(form.transactionCommissionPercent) || 0,
        monthlyFixedFee: Number(form.monthlyFixedFee) || 0,
        allowedProducts: Array.isArray(form.allowedProducts)
          ? form.allowedProducts.join(",")
          : "",
        portalUrl: form.portalAccessEnabled ? Number(form.portalUrl) : 0,
        password: form.password ? btoa(form.password) : "",
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
      isEditing ? await updatePartner(payload) : await createPartner(payload);
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
      logId: partner.logId || uuidv4(),
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
        ? "2px solid var(--borderBg-color)" // ✅ apply full border when focused
        : "1px solid var(--borderBg-color)",
      borderRadius: "8px",
      minHeight: "32px",
      outline: state.isFocused && "2px solid var(--primary-color)", // 🔹 remove browser blue outline
      boxShadow: "none", //
      // boxShadow: "0 0 10px #00f5a022", // 🔹 default shadow
      "&:hover": {
        // borderColor: "#14b8a6",
        // boxShadow: "0 0 8px rgba(20, 184, 166, 0.8)", // stronger shadow on hover
      },
      ...(state.isFocused && {
        borderColor: "var(--borderBg-color)",
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
      backgroundColor: "var(--menu-hover-bg)", // keep tags visible
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#d1d5db",
      fontSize: "13px",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "var(--borderBg-color)", // icon color
      backgroundColor: "transparent", // no background
      ":hover": {
        backgroundColor: "transparent", // custom hover bg
        color: "var(--primary-color)",
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#0f1114",
      border: "1px solid var(--borderBg-color)",
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
        backgroundColor: "var(--primary-color)",
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
  const passwordsMatch =
    form.password && confirmPassword && form.password === confirmPassword;

  useEffect(() => {
    if (!isEditing) {
      setForm(defaultFormValues);
    }
  }, [isEditing]);

  return (
    <>
      {/* Header */}
      <div className="card-header flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 p-2 sm:p-4">
        <div className="card-header-left flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2">
          <div className="flex items-center gap-2">
            <div className="header-icon-box">
              <CalculatorIcon className="primary-color w-4 h-4" />
            </div>
          </div>
          <div>
            <h1 className="user-title">Distribution Partner Management</h1>
            <p className="user-subtitle">
              Onboard and manage distribution partners
            </p>
          </div>
        </div>

        <div className="card-header-right flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <button
            className="btn-outline"
            onClick={() => {
              setformOpen((prev) => !prev), setForm({ ...defaultFormValues });
            }}
          >
            {formOpen ? (
              <>
                <span className="btn-icon">
                  <EyeOff className="w-4 h-4" />
                </span>
                Hide Form
              </>
            ) : (
              <>
                {" "}
                <span className="btn-icon">
                  <Eye className="w-4 h-4" />
                </span>{" "}
                Show Form
              </>
            )}
          </button>
          <div className="portal-info text-center sm:text-left">
            <p className="portal-label text-xs sm:text-sm">Content Creation</p>
            <p className="portal-link text-xs sm:text-sm font-medium text-center sm:text-right">
              Maker Portal
            </p>
          </div>
        </div>
      </div>

      {formOpen && (
        <form className="department-form mt-[18px]" onSubmit={handleSubmit}>
          <div className="page-header">
            <h2 className="form-title flex ">
              <CalculatorIcon className=" w-5 h-5 mr-[10px]" />
              Create Partner Configuration
            </h2>
          </div>
          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="form-group flex flex-col">
              <label className="text-sm sm:text-base mb-1 mandatory">
                Partner Name
              </label>
              <input
                type="text"
                name="partnerName"
                className="form-input p-2 text-sm sm:text-base"
                placeholder="Enter partner name"
                required
                value={form.partnerName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group flex flex-col">
              <label className="text-sm sm:text-base mb-1 mandatory">
                Contact Name
              </label>
              <input
                type="text"
                name="contactName"
                className="form-input p-2 text-sm sm:text-base"
                placeholder="Enter contact name"
                value={form.contactName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group flex flex-col">
              <label className="text-sm sm:text-base mb-1 mandatory">
                Contact Email
              </label>
              <input
                type="email"
                name="contactEmail"
                className="form-input p-2 text-sm sm:text-base"
                placeholder="Enter contact email"
                value={form.contactEmail}
                onChange={handleChange}
              />
            </div>

            <div className="form-group flex flex-col">
              <label className="text-sm sm:text-base mb-1 mandatory">
                Contact Phone
              </label>
              <input
                type="text"
                name="contactPhone"
                className="form-input p-2 text-sm sm:text-base"
                placeholder="Enter contact phone"
                value={form.contactPhone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group flex flex-col">
              <label className="text-sm sm:text-base mb-1 mandatory">
                Address
              </label>
              <input
                type="text"
                name="address"
                className="form-input text-sm sm:text-base"
                placeholder="Enter address"
                value={form.address}
                onChange={handleChange}
              />
            </div>

            <div className="form-group flex flex-col">
              <label className="text-sm sm:text-base mb-1 mandatory">
                City
              </label>
              <input
                type="text"
                name="city"
                className="form-input p-2 text-sm sm:text-base"
                placeholder="Enter city"
                value={form.city}
                onChange={handleChange}
              />
            </div>

            <div className="form-group flex flex-col">
              <label className="text-sm sm:text-base mb-1 mandatory">
                State
              </label>
              <input
                type="text"
                name="state"
                className="form-input p-2 text-sm sm:text-base"
                placeholder="Enter state"
                value={form.state}
                onChange={handleChange}
              />
            </div>

            <div className="form-group flex flex-col">
              <label className="text-sm sm:text-base mb-1 mandatory">
                Pincode
              </label>
              <input
                type="text"
                name="pincode"
                className="form-input p-2 text-sm sm:text-base"
                placeholder="Enter pincode"
                value={form.pincode}
                onChange={handleChange}
                maxLength={6}
              />
            </div>

            <div className="form-group flex flex-col">
              <label className="text-sm sm:text-base mb-1 mandatory">
                Partner Type
              </label>
              <select
                name="partnerType"
                value={form.partnerType}
                onChange={handleChange}
                className="form-input"
                required
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

            <div className="form-group flex flex-col">
              <label className="text-sm sm:text-base mb-1 mandatory">
                Partner Status
              </label>
              <select
                required
                name="partnerStatus"
                value={form.partnerStatus}
                onChange={handleChange}
                className="form-input"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="mt-8 relative">
            <h3 className="section-title">Allowed Products</h3>

            {/* Dropdown Toggle */}
            {/* <button
              type="button"
              onClick={() => setShowProductDropdown(!showProductDropdown)}
              className="w-1/2 mt-2 px-3 py-1 bg-[#0d1220] border border-teal-700/50 rounded-[8px] text-left text-gray-300 text-[13px]"
            >
              {form.allowedProducts.length > 0
                ? form.allowedProducts.join(", ")
                : "Select Products"}
            </button> */}

            {/* Dropdown Menu */}
            {/* {showProductDropdown && (
              <div className="absolute mt-0 w-1/2 bg-[#0d1220] border border-teal-700/50 rounded-[10px] shadow-lg z-10 max-h-60 overflow-y-auto">
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
        form.portalAccessEnabled
          ? "check-box-clr-after"
          : "check-box-clr-before"
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
            <h3 className="section-title text-lg sm:text-xl mb-4 text-left">
              Documents
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4 w-full">
              {/* Agreement */}
              <div className="relative  w-full flex flex-col items-center sm:items-start text-center sm:text-left">
                <label className="text-[14px] sm:text-[15px]">
                  Agreement Document
                </label>
                <p className="text-[10px] text-gray-400">
                  (PDF/JPG/PNG, Max 5MB)
                </p>

                {form.agreementDocument ? (
                  <div className="mt-2 relative group">
                    <img
                      src={`data:image/png;base64,${form.agreementDocument}`}
                      alt="Agreement Document Preview"
                      style={{
                        maxWidth: "100px",
                        cursor: "pointer",
                        border: "1px solid #ccc",
                      }}
                      className="max-w-full sm:max-w-[100px] cursor-pointer border border-gray-300 mx-auto sm:mx-0"
                      onClick={() =>
                        setModalImage(
                          `data:image/png;base64,${form.agreementDocument}`
                        )
                      }
                    />
                    <button
                      onClick={() => handleRemoveImage("agreementDocument")}
                      className="max-w-full sm:max-w-[100px] cursor-pointer border border-gray-300 mx-auto sm:mx-0"
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
                      <span className="file-name ml-2 text-sm text-gray-300 truncate max-w-[150px] sm:max-w-full">
                        {agreementFile ? agreementFile.name : "No file chosen"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* ID Proof */}
              <div className="relative w-full flex flex-col items-center sm:items-start text-center sm:text-left">
                <label className="text-[14px] sm:text-[15px]">
                  ID Proof Document
                </label>
                <p className="text-[10px] text-gray-400">
                  (PDF/JPG/PNG, Max 2MB)
                </p>

                {form.idProofDocument ? (
                  <div className="mt-2 relative group">
                    <img
                      src={`data:image/png;base64,${form.idProofDocument}`}
                      alt="ID Proof Document Preview"
                      className="max-w-full sm:max-w-[100px] cursor-pointer border border-gray-300 mx-auto sm:mx-0"
                      style={{
                        maxWidth: "100px",
                        cursor: "pointer",
                        border: "1px solid #ccc",
                      }}
                      onClick={() =>
                        setModalImage(
                          `data:image/png;base64,${form.idProofDocument}`
                        )
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
                      <span className="file-name ml-2 text-sm text-gray-300 truncate max-w-[150px] sm:max-w-full">
                        {idFile ? idFile.name : "No file chosen"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Address Proof */}
              <div className="relative w-full flex flex-col items-center sm:items-start text-center sm:text-left">
                <label className="primary-color text-[14px] sm:text-[15px]">
                  Address Proof Document
                </label>
                <p className="text-[10px] text-gray-400">
                  (PDF/JPG/PNG, Max 2MB)
                </p>

                {form.addressProofDocument ? (
                  <div className="mt-2 relative group">
                    <img
                      src={`data:image/png;base64,${form.addressProofDocument}`}
                      alt="Address Proof Document Preview"
                      className="max-w-full sm:max-w-[100px] cursor-pointer border border-gray-300 mx-auto sm:mx-0"
                      style={{
                        maxWidth: "100px",
                        cursor: "pointer",
                        border: "1px solid #ccc",
                      }}
                      onClick={() =>
                        setModalImage(
                          `data:image/png;base64,${form.addressProofDocument}`
                        )
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
                      <span className="file-name ml-2 text-sm text-gray-300 truncate max-w-[150px] sm:max-w-full">
                        {addressFile ? addressFile.name : "No file chosen"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              {modalImage && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                  onClick={() => setModalImage(null)}
                >
                  <img
                    src={modalImage}
                    alt="Zoomed Document"
                    className="max-w-full max-h-full"
                  />
                </div>
              )}
            </div>
          </div>
          {/* Advanced Configuration Section */}
          <div className="advanced-config mt-10 w-full">
            <h3 className="section-title primary-color text-lg sm:text-xl mb-4">
              Advanced Configuration
            </h3>

            {/* Compliance & KYC */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold primary-color mb-4">
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
                    {getConstraintOptions(
                      constraints,
                      "distribution_partner_kyc_level_check"
                    )?.map((opt, i) => (
                      <option key={i} value={opt}>
                        {opt}
                      </option>
                    ))}
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
                    {getConstraintOptions(
                      constraints,
                      "distribution_partner_kyc_status_check"
                    )?.map((opt, i) => (
                      <option key={i} value={opt}>
                        {opt}
                      </option>
                    ))}
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
                    {getConstraintOptions(
                      constraints,
                      "distribution_partner_status_check"
                    )?.map((opt, i) => (
                      <option key={i} value={opt}>
                        {opt}
                      </option>
                    ))}
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
                    {getConstraintOptions(
                      constraints,
                      "distribution_partner_risk_profile_check"
                    )?.map((opt, i) => (
                      <option key={i} value={opt}>
                        {opt}
                      </option>
                    ))}
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
              <h4 className="text-sm font-semibold primary-color mb-4">
                Financial Configuration
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group w-full">
                  <label className="text-sm sm:text-base">
                    Card Issuance Commission %
                  </label>
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
                      if (e.target.value > 100) {
                        e.target.value = 100;
                      }
                    }}
                  />
                </div>
                <div className="form-group w-full">
                  <label>Transaction Commission %</label>
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
                      if (e.target.value > 100) {
                        e.target.value = 100;
                      }
                    }}
                  />
                </div>

                <div className="form-group w-full">
                  <label className="text-sm sm:text-base">
                    Monthly Fixed Fee
                  </label>
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
                  <label className="text-sm sm:text-base">
                    Commission Currency
                  </label>
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
                  <label className="text-sm sm:text-base">
                    Settlement Frequency
                  </label>
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
            <div className="mt-8">
              <h4 className="text-sm font-semibold primary-color mb-4">
                Password Set-Up for Partner Portal Login
              </h4>

              <div className="grid grid-cols-2 gap-4">
                {/* Password Field */}
                <div className="form-group relative">
                  <label>Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="form-input pr-10"
                    placeholder="Enter password"
                    value={form.password || ""}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, password: e.target.value }))
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Confirm Password Field (frontend-only) */}
                <div className="form-group relative">
                  <label>Confirm Password</label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-input pr-10"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Show validation message only */}
              {confirmPassword && !passwordsMatch && (
                <p className="text-red-500 text-sm mt-2">
                  Passwords do not match.
                </p>
              )}

              {/* Optional success state */}
              {passwordsMatch && (
                <p className="text-green-500 text-sm mt-2">Passwords match!</p>
              )}
            </div>
          </div>

          <div className="form-footer flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mt-6 w-full">
            <button
              type="button"
              className="btn-outline-back  w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 px-4 py-2 text-sm sm:text-base"
              onClick={() => setformOpen(false)}
            >
              <ArrowLeft className="icon w-4 h-4 sm:w-5 sm:h-5" /> Back
            </button>
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
                <RotateCcw className="icon" /> Reset
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
        <div className="table-card mt-[18px]">
          {/* Header */}
          <div className="table-header flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4 px-2 sm:px-0">
            <div className="flex items-center gap-2 primary-color">
              <CalculatorIcon className="w-4 h-4" />
              <p className="user-table-header">
                Existing Partner Configurations
              </p>
            </div>
            <div className="search-box relative w-full sm:w-64">
              <Search
                size="14"
                className="absolute left-3 top-2 text-gray-400"
              />
              <input
                type="text"
                className="search-input !w-full pl-8 pr-2 py-1 sm:py-2 text-xs sm:text-sm rounded border border-gray-700 focus:outline-none"
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
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Partner Name</th>
                  <th>Type</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>KYC Status</th>
                  <th>Agreement</th>
                  <th>ID Proof</th>
                  <th>Address Proof</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentPartners.map((partner, index) => (
                  <tr key={index}>
                    <td className="max-w-[120px]">
                      <p className="truncate" title={partner.partnerName}>
                        {partner.partnerName}
                      </p>
                    </td>
                    <td>{partner.partnerType}</td>
                    <td className="max-w-[100px]">
                      <p
                        className="truncate"
                        title={`${partner.contactName} ${partner.contactPhone}`}
                      >
                        {partner.contactName} {partner.contactPhone}
                      </p>
                    </td>
                    <td>
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
                    <td>
                      <span
                        className={`px-2 py-1 rounded text-[10px] ${
                          partner.kycStatus === "Verified"
                            ? "checker"
                            : "superuser"
                        }`}
                      >
                        {partner.kycStatus}
                      </span>
                    </td>
                    <td>
                      {partner.agreementDocumentBase64 ? (
                        <span className="px-2 py-1 rounded text-[10px] checker">
                          Completed
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded text-[10px] infra">
                          Pending
                        </span>
                      )}
                    </td>
                    <td>
                      {partner.idProofDocumentBase64 ? (
                        <span className="px-2 py-1 rounded text-[10px] checker">
                          Verified
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded text-[10px] infra">
                          Pending
                        </span>
                      )}
                    </td>
                    <td>
                      {partner.addressProofDocumentBase64 ? (
                        <span className="px-2 py-1 rounded text-[10px] checker">
                          Verified
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded text-[10px] infra">
                          Pending
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        className="header-icon-box"
                        onClick={() => {
                          handleEdit(partner.partnerName, partner.partnerType);
                          setIsEditing(true);
                        }}
                      >
                        <SquarePen className="primary-color w-3 h-3" />
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
      {/* Guidelines */}
      <GuidelinesCard
        title="Partner Management Guidelines"
        guidelines={partnerGuidelines}
      />
    </>
  );
}
