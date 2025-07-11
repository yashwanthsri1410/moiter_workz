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
        headers: headersError ?  headersError : JSON.stringify({ "content-type": "application/json" }),
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
      setheadersError(" KYC Submission failed" );
      alert("KYC submission failed."+ (err?.response?.data?.message || ""));
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white p-8 rounded shadow-md w-full max-w-2xl space-y-4"
      >
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" className="w-12 h-12 mx-auto mb-2" />
          <h2 className="text-2xl font-semibold">Customer KYC Form</h2>
        </div>

        {/* Form Fields */}
        <div className="flex gap-4">
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="border p-2 w-full" required />
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="border p-2 w-full" required />
        </div>

        <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} placeholder="Father's Name" className="border p-2 w-full" />
        <input type="text" name="motherName" value={formData.motherName} onChange={handleChange} placeholder="Mother's Name" className="border p-2 w-full" />
        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="border p-2 w-full" required />

        <select name="gender" value={formData.gender} onChange={handleChange} className="border p-2 w-full" required>
          <option value="">Select Gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>

        <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} placeholder="Nationality" className="border p-2 w-full" required />

        <select name="residentialStatus" value={formData.residentialStatus} onChange={handleChange} className="border p-2 w-full" required>
          <option value="">Select Residential Status</option>
          <option value="Resident">Resident</option>
          <option value="Non-Resident">Non-Resident</option>
          <option value="Foreign National">Foreign National</option>
        </select>

        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="border p-2 w-full" required />

        <div className="flex gap-2">
          <select name="mobileCountryCode" value={formData.mobileCountryCode} onChange={handleChange} className="border p-2 w-24">
            <option value="+91">+91</option>
            <option value="+1">+1</option>
            <option value="+44">+44</option>
          </select>
          <input type="text" name="mobileNumberRaw" value={formData.mobileNumberRaw} onChange={handleChange} placeholder="Mobile Number" className="border p-2 w-full" maxLength={10} required />
        </div>

        <input type="text" name="alternateContactNumber" value={formData.alternateContactNumber} onChange={handleChange} placeholder="Alternate Number" className="border p-2 w-full" maxLength={10} />
        <input type="text" name="permanentAddress" value={formData.permanentAddress} onChange={handleChange} placeholder="Permanent Address" className="border p-2 w-full" required />
        <input type="text" name="correspondenceAddress" value={formData.correspondenceAddress} onChange={handleChange} placeholder="Correspondence Address" className="border p-2 w-full" />
        <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" className="border p-2 w-full" />
        <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" className="border p-2 w-full" />
        <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="Postal Code" className="border p-2 w-full" />
        <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country" className="border p-2 w-full" />

        <select name="preferredLanguage" value={formData.preferredLanguage} onChange={handleChange} className="border p-2 w-full" required>
          <option value="">Select Preferred Language</option>
          <option value="ENGLISH">English</option>
          <option value="HINDI">Hindi</option>
          <option value="TAMIL">Tamil</option>
          <option value="Telugu">Telugu</option>
          <option value="KANNADA">Kannada</option>
          <option value="MARATHI">Marathi</option>
          <option value="BENGALI">Bengali</option>
        </select>

        <select name="selectedCardType" value={formData.selectedCardType} onChange={handleChange} className="border p-2 w-full">
          <option value="">-- Select Document Type --</option>
          <option value="PAN">PAN</option>
          <option value="AADHAAR">Aadhaar</option>
          <option value="PASSPORT">Passport</option>
          <option value="VOTER_ID">Voter ID</option>
          <option value="DL">Driving License</option>
          <option value="NREGA">NREGA ID</option>
          <option value="NPR">NPR ID</option>
        </select>

        <input type="text" name="documentNumber" value={formData.documentNumber} onChange={handleChange} placeholder="Enter Document Number" className="border p-2 w-full" required />

        <input type="file" name="idProofImage" onChange={handleFileChange} accept="image/*" className="border p-2 w-full" required />
        <input type="file" name="addressProofImage" onChange={handleFileChange} accept="image/*" className="border p-2 w-full" required />

        <select name="kycMode" value={formData.kycMode} onChange={handleChange} className="border p-2 w-full">
          <option value="">Select KYC Mode</option>
          <option value="Physical">Physical</option>
          <option value="eKYC">eKYC</option>
          <option value="VideoKYC">VideoKYC</option>
        </select>

        <select name="riskCategory" value={formData.riskCategory} onChange={handleChange} className="border p-2 w-full">
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <select
          name="programId"
          value={selectedProgramId}
          onChange={(e) => setSelectedProgramId(e.target.value)}
          className="border p-2 w-full"
          required
        >
          <option value="">-- Select card type --</option>
          <option value="1">Food card</option>
          <option value="2">Fuel card</option>
          <option value="3">Gas card</option>
          <option value="4">Purchase card</option>
          <option value="5">ATM card</option>
          <option value="6">Gift card</option>
        </select>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
          Submit KYC
        </button>
      </form>
    </div>
  );
};

export default CustomerKYCForm;
