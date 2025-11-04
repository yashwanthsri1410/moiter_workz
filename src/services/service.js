import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { getPublicIp } from "./ipService";
// Base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const path = "/ps/api";
const ip = await getPublicIp();
// Common metadata

const getCommonMetadata = () => ({
  ipAddress: ip || "0.0.0.0",
  userAgent: navigator.userAgent,
  headers: "string",
  channel: "WEB",
  auditMetadata: {
    createdBy: null,
    createdDate: new Date().toISOString(),
    modifiedBy: null,
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

// Generic GET request

const getRequest = async (endpoint) => {
  try {
    const response = await api.get(endpoint);
    return response;
  } catch (error) {
    alert("Something went wrong. Please try again later");
  }
};

export const merchantOnboarding = (payload) =>
  postRequest(`${path}/Product/onboardMerchant`, {
    ...payload,
    logId: uuidv4(),
  });

export const getPinCodeDetails = (payload) =>
  postRequest(`cs/api/Customer/Pincode`, payload);

export const getMerchantDetails = () =>
  getRequest(`${path}/Product/viewOnboardedMerchants`);
