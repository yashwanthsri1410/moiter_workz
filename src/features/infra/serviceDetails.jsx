import { Search } from "lucide-react";
import React, { useState } from "react";
import { useMonitoringStore } from "../../store/monitoringStore";

const ServiceDetails = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { infraStatus } = useMonitoringStore();

  // Filter services & endpoints
  const filteredServices = infraStatus?.services
    ?.map((service) => {
      if (!searchTerm.trim()) return service;

      // Check against service.name
      const matchesService = service.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Filter endpoints by last segment
      const filteredEndpoints = service.endpoints.filter((ep) =>
        ep.url
          .split("/")
          .filter(Boolean)
          .pop()
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );

      if (matchesService || filteredEndpoints.length > 0) {
        return {
          ...service,
          endpoints:
            filteredEndpoints.length > 0
              ? filteredEndpoints
              : service.endpoints,
        };
      }

      return null;
    })
    .filter(Boolean);

  // --- Dynamic stats based on filteredServices ---
  const mainServicesCount = filteredServices?.length || 0;
  const subApiCount =
    filteredServices?.reduce(
      (acc, service) => acc + (service.endpoints?.length || 0),
      0
    ) || 0;
  const activeEndpointsCount =
    filteredServices?.reduce(
      (acc, service) =>
        acc + (service.endpoints?.filter((ep) => ep.isRunning)?.length || 0),
      0
    ) || 0;

  const stats = [
    { value: mainServicesCount, label: "Main Services" },
    { value: subApiCount, label: "Sub-API Endpoints" },
    { value: activeEndpointsCount, label: "Active Endpoints" },
  ];

  const isEmptyObj = !infraStatus || Object.keys(infraStatus).length === 0;

  return (
    <>
      {!isEmptyObj && (
        <div className="px-[40px]">
          <h1 className="root-header">API Service Details</h1>

          {/* Search Box */}
          <div className="my-6 flex items-center w-full max-w-md rounded-full bg-[#0f172a] px-4 py-2 border border-transparent focus-within:border-[var(--primary-color)] transition">
            <Search className="text-gray-400 w-4 h-4 mr-2" />
            <input
              type="text"
              placeholder="Search API services or endpoints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none text-white w-full placeholder-gray-500 text-sm"
            />
          </div>

          {/* Table */}
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>API Service</th>
                  <th>Sub API</th>
                  <th>Request Count</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices?.length > 0 ? (
                  filteredServices.map((service, sIdx) => (
                    <React.Fragment key={sIdx}>
                      <tr>
                        <td>{service?.name}</td>
                        <td>{service?.endpoints?.length === 0 ? "—" : ""}</td>
                        <td>
                          <p
                            className={`text-green-400 ${
                              service?.usageCount !== 0 && "zoom-animate"
                            }`}
                          >
                            {service?.usageCount}
                          </p>
                        </td>
                        <td>
                          <div
                            className={`inline-flex my-1 items-center px-2 py-1 rounded-full text-xs font-medium ${
                              service?.isRunning
                                ? "bg-green-900/30 text-green-400"
                                : "bg-red-900/30 text-red-400"
                            }`}
                          >
                            <span
                              className={`${
                                service.isRunning && "zoom-animate"
                              } w-[6px] h-[6px] mr-2 rounded-full bg-current`}
                            ></span>
                            {service.isRunning ? "Active" : "InActive"}
                          </div>
                        </td>
                      </tr>

                      {service.endpoints.map((ep, eIdx) => (
                        <tr key={eIdx}>
                          <td></td>
                          <td>{ep.url.split("/").filter(Boolean).pop()}</td>
                          <td
                            className={`text-green-400 ${
                              ep.usageCount !== 0 && "zoom-animate"
                            }`}
                          >
                            {ep.usageCount}
                          </td>
                          <td>
                            <div
                              className={`my-1 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                ep.isRunning
                                  ? "bg-green-900/30 text-green-400"
                                  : "bg-red-900/30 text-red-400"
                              }`}
                            >
                              <span className="zoom-animate w-[6px] h-[6px] mr-2 rounded-full bg-current"></span>
                              {ep.isRunning ? "Active" : "Down"}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-400">
                      No matching services or endpoints found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Stats */}
          <div className="flex justify-between gap-6 py-6">
            {stats.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center w-64 h-24 rounded-2xl border border-gray-700"
              >
                <div className="text-xl font-bold text-green-500">
                  {item.value}
                </div>
                <div className="text-xs text-gray-400">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ServiceDetails;
