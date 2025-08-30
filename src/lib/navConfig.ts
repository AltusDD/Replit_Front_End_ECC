const navConfig = [
  {
    label: "Dashboard",
    items: [{ label: "Home", path: "/dashboard" }]
  },
  {
    label: "Assets",
    items: [
      { label: "Properties", path: "/assets/properties" },
      { label: "Units", path: "/assets/units" }
    ]
  },
  {
    label: "Operations",
    items: [
      { label: "Leases", path: "/operations/leases" },
      { label: "Tenants", path: "/operations/tenants" },
      { label: "Owners", path: "/operations/owners" }
    ]
  },
  {
    label: "Settings",
    items: [
      { label: "Users", path: "/settings/users" },
      { label: "Preferences", path: "/settings/preferences" }
    ]
  }
];

export default navConfig;