/**
 * Auth API Service - Handle authentication with Spring Boot backend
 */

import { API_CONFIG } from "../config/api.config";
import { httpClient } from "../config/http.client";
import type { ApiResponse, CurrentUser } from "@/models";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: CurrentUser;
}

export class AuthService {
  /**
   * Login user
   */
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await httpClient.post<ApiResponse<LoginResponse>>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    
    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
      httpClient.setToken(response.data.token);
    }

    return response.data;
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    try {
      await httpClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    } finally {
      localStorage.removeItem("authToken");
      httpClient.clearToken();
    }
  }

  /**
   * Get current user info
   */
  static async getCurrentUser(): Promise<CurrentUser> {
    const response = await httpClient.get<ApiResponse<CurrentUser>>(
      API_CONFIG.ENDPOINTS.AUTH.ME
    );
    return response.data;
  }

  /**
   * Refresh auth token
   */
  static async refreshToken(): Promise<string> {
    const response = await httpClient.post<ApiResponse<{ token: string }>>(
      API_CONFIG.ENDPOINTS.AUTH.REFRESH
    );
    
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
      httpClient.setToken(response.data.token);
    }

    return response.data.token;
  }

  /**
   * Initialize with stored token on app load
   */
  static initializeToken(): void {
    const token = localStorage.getItem("authToken");
    if (token) {
      httpClient.setToken(token);
    }
  }
}
