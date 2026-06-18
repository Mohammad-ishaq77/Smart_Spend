/**
 * API Configuration
 * Centralized API base URL for all frontend API requests
 */

export const API_URL = "https://smartspend-backend-7zvx.onrender.com/api";

// You can also export individual endpoint paths for convenience
export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
};

export const EXPENSE_ENDPOINTS = {
  LIST: "/expenses",
  CREATE: "/expenses",
  DELETE: (id) => `/expenses/${id}`,
};
