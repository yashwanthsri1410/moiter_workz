export const infraStatus = {
  databaseRunning: true,
  services: [
    {
      name: "AES",
      serviceName: "Application Error Service (AES)",
      url: "http://192.168.22.247/aes",
      isRunning: true,
      usageCount: 0,
      endpoints: [],
    },
    {
      name: "ATS",
      serviceName: "Audit Trail Service (ATS)",
      url: "http://192.168.22.247/ats",
      isRunning: true,
      usageCount: 6,
      endpoints: [
        {
          url: "/ats/api/Audit/log-audit",
          usageCount: 6,
          isRunning: true,
        },
      ],
    },
    {
      name: "PS",
      serviceName: "Product Service (PS)",
      url: "http://192.168.22.247/ps",
      isRunning: true,
      usageCount: 0,
      endpoints: [],
    },
    {
      name: "UMS",
      serviceName: "User Management Service (UMS)",
      url: "http://192.168.22.247/ums",
      isRunning: true,
      usageCount: 3,
      endpoints: [
        {
          url: "/ums/api/UserManagement/user_login",
          usageCount: 3,
          isRunning: true,
        },
      ],
    },
    {
      name: "CS",
      serviceName: "Customer Service (CS)",
      url: "http://192.168.22.247/cs",
      isRunning: true,
      usageCount: 0,
      endpoints: [],
    },
    {
      name: "FES",
      serviceName: "File Export Service (FES)",
      url: "http://192.168.22.247/fes",
      isRunning: true,
      usageCount: 197,
      endpoints: [
        {
          url: "/api/Export/modules",
          usageCount: 19,
          isRunning: true,
        },
        {
          url: "/api/Export/simple-departments",
          usageCount: 37,
          isRunning: true,
        },
        {
          url: "/api/Export/modules-screens",
          usageCount: 6,
          isRunning: true,
        },
        {
          url: "/api/Export/designations",
          usageCount: 20,
          isRunning: true,
        },
        {
          url: "/api/Export/screens",
          usageCount: 8,
          isRunning: true,
        },
        {
          url: "/api/Export/wallet-transcation-dashboard",
          usageCount: 4,
          isRunning: true,
        },
        {
          url: "/api/Export/usertypes",
          usageCount: 57,
          isRunning: true,
        },
        {
          url: "/api/Export/wallet-status-dashboard",
          usageCount: 4,
          isRunning: true,
        },
        {
          url: "/api/Export/designation",
          usageCount: 6,
          isRunning: true,
        },
        {
          url: "/api/Export/product_Config_export",
          usageCount: 2,
          isRunning: true,
        },
        {
          url: "/api/Export/pending-employees",
          usageCount: 6,
          isRunning: true,
        },
        {
          url: "/api/Export/export_rbi_configuration",
          usageCount: 3,
          isRunning: true,
        },
        {
          url: "/api/Export/partner_summary_export",
          usageCount: 2,
          isRunning: true,
        },
        {
          url: "/api/Export/role-departments",
          usageCount: 10,
          isRunning: true,
        },
        {
          url: "/api/Export/role-module-screen",
          usageCount: 4,
          isRunning: true,
        },
        {
          url: "/api/Export/wallet-loaded-dashboard",
          usageCount: 4,
          isRunning: true,
        },
        {
          url: "/api/Export/wallet-unloaded-dashboard",
          usageCount: 4,
          isRunning: true,
        },
        {
          url: "/api/undefinedapi/Export/simple-departments",
          usageCount: 1,
          isRunning: true,
        },
      ],
    },
  ],
};

export const infraSummary = {
  totalRequests: 213,
  activeServices: 6,
  liveEndpoints: 21,
};
