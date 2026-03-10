/**
 * Application Constants
 */

export const APP_CONSTANTS = {
  // Application name and version
  APP_NAME: "Coconut",
  APP_VERSION: "1.0.0",

  // Route names
  ROUTES: {
    HOME: "/",
    DASHBOARD: "/dashboard",
    PATIENTS: "/patients",
    TEAM: "/team",
    DOCUMENTS: "/documents",
    REVIEWS: "/reviews",
    SETTINGS: "/settings",
    LOGIN: "/login",
  },

  // Tab names
  TABS: {
    DASHBOARD: "Dashboard",
    TEAM: "Team",
    PATIENT: "Patient",
    DOCUMENTS: "Documents",
    REVIEWS: "Reviews",
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE: 0,
    DEFAULT_PAGE_SIZE: 10,
  },

  // Toast/Notification duration (ms)
  TOAST_DURATION: 3000,

  // Date formats
  DATE_FORMAT: "DD/MM/YYYY",
  TIME_FORMAT: "HH:mm:ss",
  DATETIME_FORMAT: "DD/MM/YYYY HH:mm:ss",

  // Validation
  VALIDATION: {
    EMAIL_PATTERN: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i,
    PHONE_PATTERN: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
  },
};
