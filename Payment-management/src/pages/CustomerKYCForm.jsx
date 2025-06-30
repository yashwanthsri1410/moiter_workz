import React, { useState } from "react";
import axios from "axios";
import backgroundImg from "../assets/background.jpeg";
import logo from "../assets/favicon.png";

const MAX_FILE_SIZE_MB = 2;
const generateUniqueId = () => 'CKYC-' + Date.now();

const CustomerKYC = () => {
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
    country: "",
    kycStatus: "Pending",
    kycMode: "",
    riskCategory: "Low",
    channel: "WEB",
    selectedCardType: "",
    documentNumber: ""
  });

  const [idProofImage, setIdProofImage] = useState(null);
  const [addressProofImage, setAddressProofImage] = useState(null);
  const [emailError, setEmailError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      setEmailError("Invalid email format. Example: user@example.com");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file && file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert("File size should be less than or equal to 2MB");
      return;
    }
    if (name === "idProofImage") setIdProofImage(file);
    if (name === "addressProofImage") setAddressProofImage(file);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result?.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const logApplicationError = async (message, requestMethod, requestPayload) => {
    const errorPayload = {
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      timestamp: new Date().toISOString(),
      serviceName: "CustomerKYCService",
      moduleName: "CustomerKYCForm",
      logLevel: "ERROR",
      message,
      errorNo: "001",
      requestMethod,
      requestPayload: JSON.stringify(requestPayload),
      header: "Customer KYC Submission Failure"
    };

    try {
      await axios.post("http://192.168.22.247/app3/api/ApplicationErrorLog/log-error", errorPayload, {
        headers: { "Content-Type": "application/json" }
      });
      console.log("Application error logged.");
    } catch (logErr) {
      console.error("Failed to log application error:", logErr);
    }
  };


  const getPublicIp = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    } catch (err) {
      console.error("Failed to fetch public IP address:", err);
      return "UNKNOWN";
    }
  };

  const sendAuditLog = async (action, result, payload) => {
    const now = new Date().toISOString();
    const ip = await getPublicIp(); // ← fetch public IP

    const auditPayload = {
      actorId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      actorType: "Customer",
      actorRole: "User",
      action,
      entityType: "KYC",
      entityId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      prevState: "N/A",
      newState: JSON.stringify(payload),
      actionResult: result,
      ipAddress: ip, // ← set the IP here
      userAgent: navigator.userAgent,
      channel: formData.channel || "WEB",
      metadata: {
        created_by: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        created_date: now,
        modified_by: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        modified_date: now,
        header: {
          module: "Customer KYC",
          description: "Customer KYC Submission",
          page: "CustomerKYCForm"
        }
      }
    };

    console.log("Audit payload being sent:", auditPayload);

    try {
      await axios.post("http://192.168.22.247/app2/api/Audit/log-audit", auditPayload, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      console.log("Audit log sent successfully");
    } catch (error) {
      console.error("Audit log failed", error);
      await logApplicationError("Failed to send audit log", "POST", auditPayload);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    const mobileNumber = `${formData.mobileCountryCode}${formData.mobileNumberRaw}`;
    const now = new Date().toISOString();
    const userId = "3fa85f64-5717-4562-b3fc-2c963f66afa6";
    const ckycIdentifier = generateUniqueId();

    let documentImage = "";
    let addressProofImageEncoded = "";

    try {
      if (idProofImage) documentImage = await convertToBase64(idProofImage);
      else return alert("Please upload a valid ID proof image.");

      if (addressProofImage) addressProofImageEncoded = await convertToBase64(addressProofImage);
      else return alert("Please upload a valid address proof image.");
    } catch (err) {
      console.error("Error encoding file(s):", err);
      alert("File conversion failed.");
      await logApplicationError("Base64 file conversion failed", "LOCAL", { idProofImage, addressProofImage });
      return;
    }

    const payload = {
      customer: {
        fullName,
        fatherName: formData.fatherName,
        motherName: formData.motherName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        nationality: formData.nationality,
        residentialStatus: formData.residentialStatus,
        email: formData.email,
        mobileNumber,
        alternateContactNumber: formData.alternateContactNumber,
        permanentAddress: formData.permanentAddress,
        correspondenceAddress: formData.correspondenceAddress,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
        kycStatus: formData.kycStatus,
        kycVerificationDate: now,
        kycVerifiedBy: userId,
        riskCategory: formData.riskCategory,
        kycMode: formData.kycMode,
        channel: formData.channel,
        ckycIdentifier,
        ckycUploadDate: now,
        createdBy: userId,
        modifiedBy: userId
      },
      document: {
        documentType: formData.selectedCardType,
        documentNumber: formData.documentNumber,
        documentVerified: true,
        documentImage
      },
      addressProof: {
        addressProofType: "Address",
        addressProofImage: addressProofImageEncoded
      }
    };

    try {
      const response = await axios.post("http://192.168.22.247/app4/api/Customer/kyc", payload, {
        headers: { "Content-Type": "application/json" }
      });
      await sendAuditLog("CustomerKYCSubmission", "Success", payload);
      console.log(response.data);
      alert("KYC submitted successfully!");
    } catch (error) {
      const errorMsg = error?.response?.data?.message || "Something went wrong. Please try again.";
      await sendAuditLog("CustomerKYCSubmission", "Failed: " + errorMsg, payload);
      await logApplicationError(errorMsg, "POST", payload);
      alert("Failed to submit KYC.\n" + errorMsg);
      console.error("Error submitting KYC:", error);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      <form onSubmit={handleSubmit} className="relative z-10 bg-white p-8 rounded shadow-md w-full max-w-2xl space-y-4">
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" className="w-12 h-12 mx-auto mb-2" />
          <h2 className="text-2xl font-semibold">Customer KYC Form</h2>
        </div>

        <div className="flex gap-4">
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="border p-2 w-full" required maxLength={20}/>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="border p-2 w-full" required maxLength={20}/>
        </div>

        <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} placeholder="Father's Name" className="border p-2 w-full" maxLength={20}/>
        <input type="text" name="motherName" value={formData.motherName} onChange={handleChange} placeholder="Mother's Name" className="border p-2 w-full" maxLength={20}/>
        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="border p-2 w-full" required />

        <select name="gender" value={formData.gender} onChange={handleChange} required className="border p-2 w-full">
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} placeholder="Nationality" className="border p-2 w-full" required maxLength={20}/>

        <select name="residentialStatus" value={formData.residentialStatus} onChange={handleChange} className="border p-2 w-full" required>
          <option value="">Select Residential Status</option>
          <option value="Resident">Resident</option>
          <option value="Non-Resident">Non-Resident</option>
          <option value="Foreign National">Foreign National</option>
        </select>

        <input type="email" name="email" value={formData.email} onChange={(e) => { handleChange(e); validateEmail(e.target.value); }} placeholder="Email" className={`border p-2 w-full ${emailError ? 'border-red-500' : ''}`} required />
        {emailError && <p className="text-red-600 text-sm">{emailError}</p>}

        <div className="flex gap-2">
          <select name="mobileCountryCode" value={formData.mobileCountryCode} onChange={handleChange} className="border p-2 w-24">
            <option value="+91">+91</option>
            <option value="+1">+1</option>
            <option value="+44">+44</option>
          </select>
          <input type="text" name="mobileNumberRaw" value={formData.mobileNumberRaw} onChange={(e) => handleChange({ target: { name: 'mobileNumberRaw', value: e.target.value.replace(/\D/g, '') } })} placeholder="Mobile Number" className="border p-2 w-full" maxLength={10} required />
        </div>

        <input type="text" name="alternateContactNumber" value={formData.alternateContactNumber} onChange={handleChange} placeholder="Alternate Number" className="border p-2 w-full" maxLength={10}/>
        <input type="text" name="permanentAddress" value={formData.permanentAddress} onChange={handleChange} placeholder="Permanent Address" className="border p-2 w-full" required />
        <input type="text" name="correspondenceAddress" value={formData.correspondenceAddress} onChange={handleChange} placeholder="Correspondence Address" className="border p-2 w-full" />
        <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" className="border p-2 w-full" />
        <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" className="border p-2 w-full" />
        <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="Postal Code" className="border p-2 w-full" />
        <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country" className="border p-2 w-full" />

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

        {formData.selectedCardType && (
          <input type="text" name="documentNumber" value={formData.documentNumber} onChange={handleChange} placeholder="Enter Document Number" className="border p-2 w-full" required />
        )}

        <input type="file" name="idProofImage" onChange={handleFileChange} accept="image/*" className="border p-2 w-full" required />
        <h2 className="text-1xl font-semibold">(please submit Address Proof)</h2>
        <input type="file" name="addressProofImage" onChange={handleFileChange} accept="image/*" className="border p-2 w-full" required />
        <h2 className="text-1xl font-semibold">(please submit ID Proof)</h2>

        <select name="kycMode" value={formData.kycMode} onChange={handleChange} className="border p-2 w-full">
          <option value="">Select KYC Mode</option>
          <option value="Physical">Physical</option>
          <option value="eKYC">eKYC</option>
          <option value="VideoKYC">VideoKYC</option>
        </select>

        {/* <select name="channel" value={formData.channel} onChange={handleChange} className="border p-2 w-full">
          <option value="">Select Channel</option>
          <option value="WEB">WEB</option>
          <option value="MOBILE">MOBILE</option>
          <option value="API">API</option>
          <option value="BRANCH">BRANCH</option>
        </select> */}

        <select name="riskCategory" value={formData.riskCategory} onChange={handleChange} className="border p-2 w-full">
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
          Submit KYC
        </button>
      </form>
    </div>
  );
};

export default CustomerKYC;
