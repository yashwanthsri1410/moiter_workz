import React, { useEffect, useState } from "react";
import axios from "axios";
import usePublicIp from "../hooks/usePublicIp";

const EmployeeApproval = () => {
  const [deactiveUsers, setDeactiveUsers] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const ip = usePublicIp();
  const username = localStorage.getItem("username");

  useEffect(() => {
    fetchDeactiveUsers();
  }, []);

  const fetchDeactiveUsers = async () => {
    try {
      const res = await axios.get("http://192.168.22.247:7090/api/Export/pending-employees");
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
        ipAddress: ip,
        userAgent: navigator.userAgent,
        headers: "SampleHeader",
        channel: "WEB",
        auditMetadata: {
          createdBy: username,
          createdDate: new Date().toISOString(),
          modifiedBy: username,
          modifiedDate: new Date().toISOString(),
          header: {
            additionalProp1: { options: { propertyNameCaseInsensitive: true }, parent: "Department", root: "Approval" },
            additionalProp2: { options: { propertyNameCaseInsensitive: true }, parent: "Department", root: "Approval" },
            additionalProp3: { options: { propertyNameCaseInsensitive: true }, parent: "Department", root: "Approval" },
          },
        },
      },
    };

    try {
      await axios.post("http://192.168.22.247:5229/ums/api/UserManagement/ApproveEmployee", payload);
      alert(`✅ Employee "${user.userName}" ${selectedStatus}`);
      fetchDeactiveUsers();
    } catch (error) {
      console.error("Error approving user:", error);
      alert("❌ Failed to approve user.");
    }
  };

  const filteredUsers = deactiveUsers.filter((user) => {
    const empId = String(user.empId).toLowerCase();
    const name = user.userName?.toLowerCase() || "";
    const email = user.email?.toLowerCase() || "";
    const dept = user.deptName?.toLowerCase() || "";
    const designation = user.designationDesc?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();

    return (
      empId.includes(query) ||
      name.includes(query) ||
      email.includes(query) ||
      dept.includes(query) ||
      designation.includes(query)
    );
  });

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

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
          <h2 className="text-xl font-semibold mb-6 text-gray-100">📝 Pending Employee Approval</h2>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by name, email, emp ID, department, or designation..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full md:w-1/2 bg-[#1F2937] text-gray-200 border border-[#374151] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {currentUsers.length === 0 ? (
            <div className="text-gray-500 text-center border rounded-md py-10 bg-[#1E293B]">
              No matching pending users found.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg">
              <table className="w-full text-sm text-left bg-[#0F172A] rounded-lg">
                <thead className="uppercase text-gray-400 text-xs bg-[#1E293B]">
                  <tr className="border-b border-[#334155]">
                    <th className="px-4 py-3">Emp ID</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Designation</th>
                    <th className="px-4 py-3">Role Description</th>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">Submit</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  {currentUsers.map((user, i) => (
                    <tr key={i} className="border-b border-[#1E293B] hover:bg-[#1F2937]">
                      <td className="px-4 py-3">{user.empId}</td>
                      <td className="px-4 py-3">{user.userName}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">{user.deptName}</td>
                      <td className="px-4 py-3">{user.designationDesc}</td>
                      <td className="px-4 py-3">{user.roleDescription}</td>
                      <td className="px-4 py-3">
                        <select
                          value={statusMap[user.empId] || ""}
                          onChange={(e) => handleStatusChange(user.empId, e.target.value)}
                          className="w-full bg-[#1F2937] border border-gray-600 rounded-md px-2 py-1 text-gray-300 focus:ring-1 focus:ring-purple-500"
                        >
                          <option value="">Select</option>
                          <option value="Approved">✅ Approved</option>
                          <option value="Disapproved">❌ Disapproved</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleSubmit(user)}
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
              {indexOfFirstUser + 1}-
              {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length}
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

export default EmployeeApproval;
