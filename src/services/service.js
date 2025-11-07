import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { getPublicIp } from "./ipService";
// Base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const path = "/ps/api";
const ip = await getPublicIp();
const username = localStorage.getItem("username");

// Common metadata
const getCommonMetadata = () => ({
  ipAddress: ip || "0.0.0.0",
  userAgent: navigator.userAgent,
  headers: "string",
  channel: "WEB",
  auditMetadata: {
    createdBy: username || null,
    createdDate: new Date().toISOString(),
    modifiedBy: username || null,
    modifiedDate: new Date().toISOString(),
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
});

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor — add metadata
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Add metadata for POST/PUT requests
    if (config.method === "post" || config.method === "put") {
      config.data = {
        ...config.data,
        metadata: getCommonMetadata(),
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Generic POST request
const postRequest = async (endpoint, payload) => {
  try {
    const response = await api.post(endpoint, payload);
    return response;
  } catch (error) {
    // Check if it's an Axios error
    if (error.response) {
      // Return the error response so frontend can inspect it
      return error.response;
    } else {
      // Network error
      alert("Something went wrong. Please try again later");
      return { data: null, status: 0 };
    }
  }
};

// Generic PUT request
const putRequest = async (endpoint, payload) => {
  try {
    const response = await api.put(endpoint, payload);
    return response;
  } catch (error) {
    // Check if it's an Axios error
    if (error.response) {
      // Return the error response so frontend can inspect it
      return error.response;
    } else {
      // Network error
      alert("Something went wrong. Please try again later");
      return { data: null, status: 0 };
    }
  }
};

// Generic GET request

const getRequest = async (endpoint) => {
  try {
    const response = await api.get(endpoint);
    return response;
  } catch (error) {
    alert("Something went wrong. Please try again later");
  }
};


// ---------------POST METHOD--------------------
export const DepartmentCreate = (payload) =>
  postRequest(`${API_BASE_URL}/ums/api/UserManagement/department_create`, {
    ...payload,
    logId: uuidv4(),
  });

export const DesignationCreate = (payload) =>
  postRequest(`${API_BASE_URL}/ums/api/UserManagement/designation_create`, {
    ...payload,
    logId: uuidv4(),
  });

export const ModuleCreate = (payload) =>
  postRequest(`${API_BASE_URL}/ums/api/UserManagement/module_create`, {
    ...payload,
    logId: uuidv4(),
  });

  export const ScreenCreate = (payload) =>
  postRequest(`${API_BASE_URL}/ums/api/UserManagement/screen_create`, {
    ...payload,
    logId: uuidv4(),
  });

  export const RoleCreate = (payload) =>
  postRequest(`${API_BASE_URL}/ums/api/UserManagement/role-access/bulk`, {
    ...payload,
    logId: uuidv4(),
  });

export const merchantOnboarding = (payload) =>
  postRequest(`${path}/Product/onboardMerchant`, {
    ...payload,
    logId: uuidv4(),
  });

export const approveEmployeeAction = (payload) =>
  postRequest(`/ums/api/UserManagement/ApproveEmployee`, {
    ...payload,
    logId: uuidv4(),
  });

export const approvePartnerEmoneyAction = (payload) =>
  postRequest(`/pms/api/Partner/approve-partnerledger`, {
    ...payload,
    logId: uuidv4(),
  });


export const getPinCodeDetails = (payload) =>
  postRequest(`cs/api/Customer/Pincode`, payload);

//----------------PUT METHOD--------------------
export const DepartmentUpdate = (payload) =>
  putRequest(`${API_BASE_URL}/ums/api/UserManagement/department_update`, {
    ...payload,
  });

export const DesignationUpdate = (payload) =>
  putRequest(`${API_BASE_URL}/ums/api/UserManagement/designation_update`, {
    ...payload,
  });

export const ModuleUpdate = (payload) =>
  putRequest(`${API_BASE_URL}/ums/api/UserManagement/module_update`, {
    ...payload,
  });

  export const ScreenUpdate = (payload) =>
  putRequest(`${API_BASE_URL}/ums/api/UserManagement/screen_update`, {
    ...payload,
  });

    export const RoleUpdate = (payload) =>
  putRequest(`${API_BASE_URL}/ums/api/UserManagement/update-role-access/bulk`, {
    ...payload,
  });

// ---------------GET METHOD--------------------
export const getDepartmentData = () =>
  getRequest(`${API_BASE_URL}/fes/api/Export/simple-departments`);

export const getDesignationData = () =>
  getRequest(`${API_BASE_URL}/fes/api/Export/designations`);

export const getModuleData = () =>
  getRequest(`${API_BASE_URL}/fes/api/Export/modules`);

export const getScreenData = () =>
  getRequest(`${API_BASE_URL}/fes/api/Export/screens`);

export const getRolesData = () =>
  getRequest(`${API_BASE_URL}/fes/api/Export/role-module-screen`);

export const getMerchantDetails = () =>
  getRequest(`${path}/Product/viewOnboardedMerchants`);

export const getpartnerledgerData = (id) =>
  getRequest(`${API_BASE_URL}/pms/api/Partner/get-partnerledger/${id}`);

export const getpartnerData = () =>
  getRequest(`${API_BASE_URL}/fes/api/Export/partner_summary_export`);

export const getPendingEmployeeData = () =>
  getRequest(`${API_BASE_URL}/fes/api/Export/pending-employees`);

export const getMerchantData = () =>
  getRequest(`${API_BASE_URL}/ps/api/Product/viewOnboardedMerchants`);

export const getPendingProductData = () =>
  getRequest(`${API_BASE_URL}/fes/api/Export/product_Config_export`);

export const getPendingPartnerData = () =>
  getRequest(`${API_BASE_URL}/fes/api/Export/partner_summary_export`);
