import React, { useState } from "react";
import axios from "axios";
import backgroundImg from "../assets/background.jpeg";
import logo from "../assets/favicon.png";
import usePublicIp from "../hooks/usePublicIp";

const generateUniqueId = () => `CKYC-${Date.now()}`;

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = (error) => reject(error);
  });
};

const CustomerKYCForm = () => {
  const ip = usePublicIp();
  const username = localStorage.getItem("username");
  // console.log(ip)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    fatherName: "",
    motherName: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    residentialStatus: "",
    email: "",
    mobileCountryCode: "+91",
    mobileNumberRaw: "",
    alternateContactNumber: "",
    permanentAddress: "",
    correspondenceAddress: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    kycMode: "Physical",
    preferredLanguage: "ENGLISH",
    selectedCardType: "AADHAAR",
    documentNumber: "",
    riskCategory: "Low",
  });

  const [idProofImage, setIdProofImage] = useState(null);
  const [addressProofImage, setAddressProofImage] = useState(null);
  const [selectedProgramId, setSelectedProgramId] = useState("");
  const [headersError, setheadersError] = useState("");
  // console.log(headersError)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "idProofImage") {
      setIdProofImage(files[0]);
    } else if (name === "addressProofImage") {
      setAddressProofImage(files[0]);
    }
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      alert("Invalid email address");
      return;
    }

    if (!idProofImage || !addressProofImage) {
      alert("Both document images are required.");
      return;
    }

    try {
      const [idBase64, addressBase64] = await Promise.all([
        getBase64(idProofImage),
        getBase64(addressProofImage),
      ]);

      const mobileNumber = `${formData.mobileCountryCode}${formData.mobileNumberRaw}`;
      const now = new Date().toISOString();
      const userId = "3fa85f64-5717-4562-b3fc-2c963f66afa6";

      const metadata = {
        ipAddress: ip,
        userAgent: navigator.userAgent,
        headers: headersError ? headersError : JSON.stringify({ "content-type": "application/json" }),
        channel: "WEB",
        auditMetadata: {
          createdBy: userId,
          createdDate: now,
          modifiedBy: userId,
          modifiedDate: now,
          header: {
            additionalProp1: {
              options: { propertyNameCaseInsensitive: true },
              parent: "string",
              root: "string",
            },
            additionalProp2: {
              options: { propertyNameCaseInsensitive: true },
              parent: "string",
              root: "string",
            },
            additionalProp3: {
              options: { propertyNameCaseInsensitive: true },
              parent: "string",
              root: "string",
            },
          },
        },
      };

      const payload = {
        customer: {
          ...formData,
          mobileNumber,
          kycStatus: "Pending",
          kycVerificationDate: now,
          kycVerifiedBy: userId,
          channel: "WEB",
          ckycIdentifier: generateUniqueId(),
          ckycUploadDate: now,
          createdBy: userId,
          modifiedBy: userId,
          programId: parseInt(selectedProgramId),
        },
        document: {
          documentType: formData.selectedCardType,
          documentNumber: formData.documentNumber,
          documentVerified: true,
          documentImage: idBase64,
        },
        addressProof: {
          addressProofType: "Address",
          addressProofImage: addressBase64,
        },
        metadata,
      };

      console.log("Final Payload:", payload);

      await axios.post("http://192.168.22.247/cs/api/Customer/kyc", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      alert("KYC submitted successfully!");
    } catch (err) {
      console.error("Submission failed:", err?.response?.data?.message);
      setheadersError(" KYC Submission failed");
      alert("KYC submission failed." + (err?.response?.data?.message || ""));
    }
  };
  const inputStyle = "w-full bg-[#1b1b3b] text-white border border-[#444] rounded px-4 py-2 placeholder-gray-400 focus:outline-none focus:border-purple-500";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d28] p-6">
      <div className="w-full max-w-4xl bg-[#11112b] rounded-xl shadow-lg p-8">
        <div className="text-center mb-6">
          <img src={logo} alt="Logo" className="w-14 h-14 mx-auto mb-4" />
          <h2 className="text-white font-semibold text-2xl">Customer Registration Form</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-white">

          {/* Customer Information */}
          <div className="grid grid-cols-2 gap-4">
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className={inputStyle} />
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className={inputStyle} />
            <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} placeholder="Father's Name" className={inputStyle} />
            <input type="text" name="motherName" value={formData.motherName} onChange={handleChange} placeholder="Mother's Name" className={inputStyle} />
            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className={inputStyle} />
            <select name="gender" value={formData.gender} onChange={handleChange} className={inputStyle}>
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
            <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} placeholder="Nationality" className={inputStyle} />
            <select name="residentialStatus" value={formData.residentialStatus} onChange={handleChange} className={inputStyle}>
              <option value="">Select Residential Status</option>
              <option value="Resident">Resident</option>
              <option value="Non-Resident">Non-Resident</option>
              <option value="Foreign National">Foreign National</option>
            </select>
          </div>

          {/* Company Information */}
          <div className="grid grid-cols-2 gap-4">
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className={inputStyle} />
            <div className="flex gap-2">
              <select name="mobileCountryCode" value={formData.mobileCountryCode} onChange={handleChange} className={`w-24 ${inputStyle}`}>
                <option value="+91">+91</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
              </select>
              <input type="text" name="mobileNumberRaw" value={formData.mobileNumberRaw} onChange={handleChange} placeholder="Mobile Number" className={`w-full ${inputStyle}`} maxLength={10} />
            </div>
             <input type="text" name="permanentAddress" value={formData.permanentAddress} onChange={handleChange} placeholder="Permanent Address" className={inputStyle} />
            <input type="text" name="alternateContactNumber" value={formData.alternateContactNumber} onChange={handleChange} placeholder="Alternate Number" className={inputStyle} maxLength={10} />
           
            <input type="text" name="correspondenceAddress" value={formData.correspondenceAddress} onChange={handleChange} placeholder="Correspondence Address" className={inputStyle} />
            <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" className={inputStyle} />
            <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" className={inputStyle} />
            <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="Postal Code" className={inputStyle} />
            <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country" className={inputStyle} />
            <select name="preferredLanguage" value={formData.preferredLanguage} onChange={handleChange} className={inputStyle}>
              <option value="">Select Preferred Language</option>
              <option value="ENGLISH">English</option>
              <option value="HINDI">Hindi</option>
              <option value="TAMIL">Tamil</option>
              <option value="TELUGU">Telugu</option>
              <option value="KANNADA">Kannada</option>
              <option value="MARATHI">Marathi</option>
              <option value="BENGALI">Bengali</option>
            </select>
          </div>
          <div >Documents</div>
          {/* Preferences */}
          <div className="grid grid-cols-2 gap-4">

            <select name="selectedCardType" value={formData.selectedCardType} onChange={handleChange} className={inputStyle}>
              <option value="">Select Document Type</option>
              <option value="PAN">PAN</option>
              <option value="AADHAAR">Aadhaar</option>
              <option value="PASSPORT">Passport</option>
              <option value="VOTER_ID">Voter ID</option>
              <option value="DL">Driving License</option>
              <option value="NREGA">NREGA ID</option>
              <option value="NPR">NPR ID</option>
            </select>

            <input type="file" name="idProofImage" onChange={handleFileChange} className="w-full bg-[#1b1b3b] text-white border border-[#444] rounded px-4 py-2 file:bg-[#333] file:text-white file:border-none" />
            <input type="text" name="documentNumber" value={formData.documentNumber} onChange={handleChange} placeholder="Document Number" className={inputStyle} />
            <input type="file" name="addressProofImage" onChange={handleFileChange} className="w-full bg-[#1b1b3b] text-white border border-[#444] rounded px-4 py-2 file:bg-[#333] file:text-white file:border-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select name="kycMode" value={formData.kycMode} onChange={handleChange} className={inputStyle}>
              <option value="">Select KYC Mode</option>
              <option value="Physical">Physical</option>
              <option value="eKYC">eKYC</option>
              <option value="VideoKYC">VideoKYC</option>
            </select>
            <select name="riskCategory" value={formData.riskCategory} onChange={handleChange} className={inputStyle}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <select name="programId" value={selectedProgramId} onChange={(e) => setSelectedProgramId(e.target.value)} className={inputStyle}>
              <option value="">Select Card Type</option>
              <option value="1">Food Card</option>
              <option value="2">Fuel Card</option>
              <option value="3">Gas Card</option>
              <option value="4">Purchase Card</option>
              <option value="5">ATM Card</option>
              <option value="6">Gift Card</option>
            </select>
          </div>

          {/* Consent & Signature */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-white text-sm">
              <input type="checkbox" />
              I agree to the terms and conditions.
            </label>
            <label className="flex items-center gap-2 text-white text-sm">
              <input type="checkbox" />
              I would like to receive promotional emails and updates.
            </label>
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-md hover:opacity-90 transition">
            Submit Registration
          </button>
        </form>
      </div>
    </div>
  );


};

export default CustomerKYCForm;
