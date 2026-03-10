/**
 * User API Service - CRUD operations for users
 * Currently using mock data - Update to use real API calls when backend is ready
 */

import { API_CONFIG } from "../config/api.config";
import { httpClient } from "../config/http.client";
import type { ApiResponse, PaginatedResponse, User, CreateUserRequest, UpdateUserRequest } from "@/models";
import { MOCK_USERS, delay } from "./mock.data";

const USE_MOCK_DATA = true; // Toggle to switch between mock and real API

export class UserService {
  /**
   * Get all users with pagination
   */
  static async getUsers(page: number = 0, pageSize: number = 10): Promise<PaginatedResponse<User>> {
    if (USE_MOCK_DATA) {
      await delay();
      const start = page * pageSize;
      const end = start + pageSize;
      return {
        content: MOCK_USERS.slice(start, end),
        totalElements: MOCK_USERS.length,
        totalPages: Math.ceil(MOCK_USERS.length / pageSize),
        currentPage: page,
        pageSize: pageSize,
        hasNext: end < MOCK_USERS.length,
        hasPrevious: page > 0,
      };
    }

    const response = await httpClient.get<ApiResponse<PaginatedResponse<User>>>(
      `${API_CONFIG.ENDPOINTS.USERS.LIST}?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  }

  /**
   * Get user by ID
   */
  static async getUserById(id: string): Promise<User> {
    if (USE_MOCK_DATA) {
      await delay();
      const user = MOCK_USERS.find((u) => u.id === id);
      if (!user) throw new Error("User not found");
      return user;
    }

    const response = await httpClient.get<ApiResponse<User>>(
      API_CONFIG.ENDPOINTS.USERS.GET(id)
    );
    return response.data;
  }

  /**
   * Create new user
   */
  static async createUser(userData: CreateUserRequest): Promise<User> {
    if (USE_MOCK_DATA) {
      await delay();
      const newUser: User = {
        id: `USR${MOCK_USERS.length + 1}`,
        ...userData,
        avatar: undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      MOCK_USERS.push(newUser);
      return newUser;
    }

    const response = await httpClient.post<ApiResponse<User>>(
      API_CONFIG.ENDPOINTS.USERS.CREATE,
      userData
    );
    return response.data;
  }

  /**
   * Update user
   */
  static async updateUser(id: string, userData: UpdateUserRequest): Promise<User> {
    if (USE_MOCK_DATA) {
      await delay();
      const userIndex = MOCK_USERS.findIndex((u) => u.id === id);
      if (userIndex === -1) throw new Error("User not found");
      MOCK_USERS[userIndex] = { ...MOCK_USERS[userIndex], ...userData, updatedAt: new Date().toISOString() };
      return MOCK_USERS[userIndex];
    }

    const response = await httpClient.put<ApiResponse<User>>(
      API_CONFIG.ENDPOINTS.USERS.UPDATE(id),
      userData
    );
    return response.data;
  }

  /**
   * Delete user
   */
  static async deleteUser(id: string): Promise<void> {
    if (USE_MOCK_DATA) {
      await delay();
      const userIndex = MOCK_USERS.findIndex((u) => u.id === id);
      if (userIndex === -1) throw new Error("User not found");
      MOCK_USERS.splice(userIndex, 1);
      return;
    }

    await httpClient.delete(
      API_CONFIG.ENDPOINTS.USERS.DELETE(id)
    );
  }

  /**
   * Search users
   */
  static async searchUsers(query: string): Promise<User[]> {
    if (USE_MOCK_DATA) {
      await delay();
      const lowerQuery = query.toLowerCase();
      return MOCK_USERS.filter(
        (u) =>
          u.firstName.toLowerCase().includes(lowerQuery) ||
          u.lastName.toLowerCase().includes(lowerQuery) ||
          u.email.toLowerCase().includes(lowerQuery)
      );
    }

    const response = await httpClient.get<ApiResponse<User[]>>(
      `${API_CONFIG.ENDPOINTS.USERS.LIST}?search=${encodeURIComponent(query)}`
    );
    return response.data;
  }
}
