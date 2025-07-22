import React, { useEffect, useState } from "react";
import axios from "axios";
import usePublicIp from "../hooks/usePublicIp";

const CustomerApproval = () => {
  const [pendingCustomers, setPendingCustomers] = useState([]);
  const [customerStatusMap, setCustomerStatusMap] = useState({});
  const [headersError, setHeadersError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const username = localStorage.getItem("username");
  const ip = usePublicIp();

  useEffect(() => {
    fetchPendingCustomers();
  }, []);

  const fetchPendingCustomers = async () => {
    try {
      const res = await axios.get("http://192.168.22.247:7090/api/Export/pending-customers");
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
        headers: headersError || JSON.stringify({ "content-type": "application/json" }),
        channel: "WEB",
        auditMetadata: {
          createdBy: username,
          createdDate: new Date().toISOString(),
          modifiedBy: username,
          modifiedDate: new Date().toISOString(),
          header: {
            additionalProp1: { options: { propertyNameCaseInsensitive: true }, parent: "Customer", root: "Approval" },
            additionalProp2: { options: { propertyNameCaseInsensitive: true }, parent: "Customer", root: "Approval" },
            additionalProp3: { options: { propertyNameCaseInsensitive: true }, parent: "Customer", root: "Approval" },
          },
        },
      },
    };

    try {
      await axios.post("http://192.168.22.247/cs/api/Customer/approve-request", payload);
      alert(`✅ Customer "${customer.firstName}" ${selectedStatus}`);
      fetchPendingCustomers();
    } catch (error) {
      console.error("Error approving customer:", error);
      setHeadersError(" KYC Submission failed");
      alert("❌ Failed to approve customer.");
    }
  };

  const filteredCustomers = pendingCustomers.filter((customer) => {
    const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
    const docNumber = customer.documentNumber?.toLowerCase() || "";
    const customerId = String(customer.customerId);
    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      docNumber.includes(searchQuery.toLowerCase()) ||
      customerId.includes(searchQuery)
    );
  });

  const indexOfLastCustomer = currentPage * itemsPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-gray-200 p-10">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#111827] rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-100 text-center">
            📝 Pending Customers Approval
          </h2>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by name, document number, or ID..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full md:w-1/2 bg-[#1F2937] text-gray-200 border border-[#374151] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {currentCustomers.length === 0 ? (
            <div className="text-gray-500 text-center border rounded-md py-10 bg-[#1E293B]">
              No matching pending customers found.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg">
              <table className="w-full text-sm text-left bg-[#0F172A] rounded-lg">
                <thead className="uppercase text-gray-400 text-xs bg-[#1E293B]">
                  <tr className="border-b border-[#334155]">
                    <th className="px-4 py-3">Customer ID</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Document Type</th>
                    <th className="px-4 py-3">Document Number</th>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">Submit</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  {currentCustomers.map((customer, index) => (
                    <tr key={index} className="border-b border-[#1E293B] hover:bg-[#1F2937]">
                      <td className="px-4 py-3">{customer.customerId}</td>
                      <td className="px-4 py-3">
                        {customer.firstName} {customer.lastName}
                      </td>
                      <td className="px-4 py-3">{customer.documentType}</td>
                      <td className="px-4 py-3">{customer.documentNumber}</td>
                      <td className="px-4 py-3">
                        <select
                          value={customerStatusMap[customer.customerId] || ""}
                          onChange={(e) =>
                            handleCustomerStatusChange(customer.customerId, e.target.value)
                          }
                          className="w-full bg-[#1F2937] border border-gray-600 rounded-md px-2 py-1 text-gray-300 focus:ring-1 focus:ring-purple-500"
                        >
                          <option value="">Select</option>
                          <option value="Approved">✅ Approved</option>
                          <option value="Disapproved">❌ Disapproved</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleCustomerSubmit(customer)}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-md shadow"
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

          <div className="flex justify-between items-center text-gray-400 text-sm mt-6">
            <p>
              {indexOfFirstCustomer + 1}-
              {Math.min(indexOfLastCustomer, filteredCustomers.length)} of {filteredCustomers.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={goToPreviousPage}
                className="p-2 rounded hover:bg-[#1F2937]"
                disabled={currentPage === 1}
              >
                &lt;
              </button>
              <span className="p-2 rounded-full bg-purple-600 text-white">{currentPage}</span>
              <button
                onClick={goToNextPage}
                className="p-2 rounded hover:bg-[#1F2937]"
                disabled={currentPage === totalPages || totalPages === 0}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerApproval;
