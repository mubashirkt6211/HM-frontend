/**
 * API Configuration - Spring Boot Backend URLs
 */

export const API_CONFIG = {
  // Base API URL - Configure based on environment
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",

  // API Endpoints
  ENDPOINTS: {
    // Auth
    AUTH: {
      LOGIN: "/auth/login",
      LOGOUT: "/auth/logout",
      REFRESH: "/auth/refresh",
      ME: "/auth/me",
    },

    // Users
    USERS: {
      BASE: "/users",
      LIST: "/users",
      GET: (id: string) => `/users/${id}`,
      CREATE: "/users",
      UPDATE: (id: string) => `/users/${id}`,
      DELETE: (id: string) => `/users/${id}`,
    },

    // Patients
    PATIENTS: {
      BASE: "/patients",
      LIST: "/patients",
      GET: (id: string) => `/patients/${id}`,
      CREATE: "/patients",
      UPDATE: (id: string) => `/patients/${id}`,
      DELETE: (id: string) => `/patients/${id}`,
      SEARCH: "/patients/search",
    },

    // Teams
    TEAMS: {
      BASE: "/teams",
      LIST: "/teams",
      GET: (id: string) => `/teams/${id}`,
      CREATE: "/teams",
      UPDATE: (id: string) => `/teams/${id}`,
      DELETE: (id: string) => `/teams/${id}`,
      MEMBERS: (id: string) => `/teams/${id}/members`,
    },

    // Documents
    DOCUMENTS: {
      BASE: "/documents",
      LIST: "/documents",
      GET: (id: string) => `/documents/${id}`,
      CREATE: "/documents",
      UPLOAD: "/documents/upload",
      DELETE: (id: string) => `/documents/${id}`,
    },

    // Reviews
    REVIEWS: {
      BASE: "/reviews",
      LIST: "/reviews",
      GET: (id: string) => `/reviews/${id}`,
      CREATE: "/reviews",
      UPDATE: (id: string) => `/reviews/${id}`,
      DELETE: (id: string) => `/reviews/${id}`,
    },
  },

  // Request timeout (ms)
  TIMEOUT: 30000,

  // Retry configuration
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000,
  },
};
