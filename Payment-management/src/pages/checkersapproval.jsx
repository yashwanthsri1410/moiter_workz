import React, { useEffect, useState } from "react";
import axios from "axios";
import backgroundImg from "../assets/background.jpeg";
import logo from "../assets/favicon.png";
import usePublicIp from "../hooks/usePublicIp";

const Checkersapproval = () => {
  const [deactiveUsers, setDeactiveUsers] = useState([]);
  const [statusMap, setStatusMap] = useState({});

  const [headersError, setheadersError] = useState("");

  const ip = usePublicIp();

  useEffect(() => {
    fetchDeactiveUsers();
  }, []);

  const fetchDeactiveUsers = async () => {
    try {
      const res = await axios.get(
        "http://192.168.22.247:7227/cache/api/CombinedDetails/EmployeePending"
      );
      setDeactiveUsers(res.data || []);
    } catch (error) {
      console.error("Failed to fetch deactive users:", error);
      alert("Error loading deactive users.");
    }
  };

  const handleStatusChange = (empId, value) => {
    setStatusMap((prev) => ({ ...prev, [empId]: value }));
  };

  const handleSubmit = async (user) => {
    const selectedStatus = statusMap[user.empId];
    if (!selectedStatus) {
      alert("Please select Approved or Disapproved");
      return;
    }

    const actionStatus = selectedStatus === "Approved" ? 0 : 2;

    const payload = {
      name: user.userName,
      checker: "admin",
      actionStatus,
      metadata: {
        ipAddress: "192.168.1.1",
        userAgent: navigator.userAgent,
        headers: "SampleHeader",
        channel: "WEB",
        auditMetadata: {
          createdBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          createdDate: new Date().toISOString(),
          modifiedBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          modifiedDate: new Date().toISOString(),
          header: {
            additionalProp1: {
              options: { propertyNameCaseInsensitive: true },
              parent: "Department",
              root: "Approval"
            },
            additionalProp2: {
              options: { propertyNameCaseInsensitive: true },
              parent: "Department",
              root: "Approval"
            },
            additionalProp3: {
              options: { propertyNameCaseInsensitive: true },
              parent: "Department",
              root: "Approval"
            }
          }
        }
      }
    };

    console.log("Payload:", payload);
    console.log("Payload before submission:", JSON.stringify(payload, null, 2));
    try {
      await axios.post(
        "http://192.168.22.247/us/api/Department/approve-by-name",
        payload
      );
      alert(`✅ Employee "${user.userName}" ${selectedStatus}`);
      fetchDeactiveUsers();
    } catch (error) {
      console.error("Error approving user:", error);
      alert("❌ Failed to approve user.");
    }
  };
  const [pendingCustomers, setPendingCustomers] = useState([]);
  const [customerStatusMap, setCustomerStatusMap] = useState({});

  useEffect(() => {
    fetchPendingCustomers();
  }, []);

  const fetchPendingCustomers = async () => {
    try {
      const res = await axios.get(
        "http://192.168.22.247:7227/cache/api/CombinedDetails/CustomerPending"
      );
      setPendingCustomers(res.data || []);
    } catch (error) {
      console.error("Failed to fetch pending customers:", error);
      alert("Error loading pending customers.");
    }
  };

  const handleCustomerStatusChange = (customerId, value) => {
    setCustomerStatusMap((prev) => ({ ...prev, [customerId]: value }));
  };

  const handleCustomerSubmit = async (customer) => {
    const selectedStatus = customerStatusMap[customer.customerId];
    if (!selectedStatus) {
      alert("Please select Approved or Disapproved");
      return;
    }

    const actionStatus = selectedStatus === "Approved" ? 0 : 2;

    const payload = {
      firstName: customer.firstName,
      lastName: customer.lastName,
      checker: "admin",
      actionStatus,
      metadata: {
        ipAddress: ip,
        userAgent: navigator.userAgent,
        headers: headersError ? headersError : JSON.stringify({ "content-type": "application/json" }),
        headers: "SampleHeader",
        channel: "WEB",
        auditMetadata: {
          createdBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          createdDate: new Date().toISOString(),
          modifiedBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          modifiedDate: new Date().toISOString(),
          header: {
            additionalProp1: {
              options: { propertyNameCaseInsensitive: true },
              parent: "Customer",
              root: "Approval"
            },
            additionalProp2: {
              options: { propertyNameCaseInsensitive: true },
              parent: "Customer",
              root: "Approval"
            },
            additionalProp3: {
              options: { propertyNameCaseInsensitive: true },
              parent: "Customer",
              root: "Approval"
            }
          }
        }
      }
    };
    // console.log("Payload:", payload);
    // console.log("Payload before submission:", JSON.stringify(payload, null, 2));
    try {
      await axios.post(
        "http://192.168.22.247/cs/api/Customer/approve-request",
        payload
      );
      alert(`✅ Customer "${customer.firstName}" ${selectedStatus}`);
      fetchPendingCustomers();
    } catch (error) {
      console.error("Error approving customer:", error);
      setheadersError(" KYC Submission failed");
      alert("❌ Failed to approve customer.");
    }
  };
// console.log(deactiveUsers)
  return (
    <div
      className="min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <img src={logo} alt="Logo" className="w-12" />
          <h2 className="text-xl font-bold">Pending Users Approval</h2>
        </div>
        <h2 className="text-xl font-bold mt-8 mb-4">Pending Employee Approval</h2>
        {deactiveUsers.length === 0 ? (
          <p className="text-gray-500">No pending users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border">
              <thead>
                <tr className="bg-gray-200 text-left text-sm">
                  <th className="p-2">Emp ID</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Department</th>
                  <th className="p-2">Designation</th>
                  <th className="p-2">Screen</th>
                  <th className="p-2">Action</th>
                  <th className="p-2">Submit</th>
                </tr>
              </thead>
              <tbody>
                {Array.from(
                  new Map(deactiveUsers.map((user) => [user.empId, user])).values()
                ).map((user, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-2">{user.empId}</td>
                    <td className="p-2">{user.userName}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">{user.deptName}</td>
                    <td className="p-2">{user.designationDesc}</td>
                    <td className="p-2">{user.screenDesc}</td>
                    <td className="p-2">
                      <select
                        value={statusMap[user.empId] || ""}
                        onChange={(e) => handleStatusChange(user.empId, e.target.value)}
                        className="border px-2 py-1 rounded"
                      >
                        <option value="">Select</option>
                        <option value="Approved">Approved</option>
                        <option value="Disapproved">Disapproved</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => handleSubmit(user)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
                      >
                        Submit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <h2 className="text-xl font-bold mt-8 mb-4">Pending Customers Approval</h2>
        {pendingCustomers.length === 0 ? (
          <p className="text-gray-500">No pending customers found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border">
              <thead>
                <tr className="bg-gray-200 text-left text-sm">
                  <th className="p-2">Customer ID</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Document Type</th>
                  <th className="p-2">Document Number</th>
                  <th className="p-2">Address Proof</th>
                  <th className="p-2">Action</th>
                  <th className="p-2">Submit</th>
                </tr>
              </thead>
              <tbody>
                {Array.from(
                  new Map(pendingCustomers.map((c) => [c.customerId, c])).values()
                ).map((customer, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-2">{customer.customerId}</td>
                    <td className="p-2">{customer.firstName} {customer.lastName}</td>
                    <td className="p-2">{customer.documentType}</td>
                    <td className="p-2">{customer.documentNumber}</td>
                    <td className="p-2">{customer.addressProofType}</td>
                    <td className="p-2">
                      <select
                        value={customerStatusMap[customer.customerId] || ""}
                        onChange={(e) =>
                          handleCustomerStatusChange(customer.customerId, e.target.value)
                        }
                        className="border px-2 py-1 rounded"
                      >
                        <option value="">Select</option>
                        <option value="Approved">Approved</option>
                        <option value="Disapproved">Disapproved</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => handleCustomerSubmit(customer)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
                      >
                        Submit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkersapproval;
