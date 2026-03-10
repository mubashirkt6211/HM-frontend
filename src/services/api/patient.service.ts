/**
 * Patient API Service - CRUD operations for patients
 * Currently using mock data - Update to use real API calls when backend is ready
 */

import { API_CONFIG } from "../config/api.config";
import { httpClient } from "../config/http.client";
import type { ApiResponse, PaginatedResponse, Patient, CreatePatientRequest, UpdatePatientRequest } from "@/models";
import { MOCK_PATIENTS, delay } from "./mock.data";

const USE_MOCK_DATA = true; // Toggle to switch between mock and real API

export class PatientService {
  /**
   * Get all patients with pagination
   */
  static async getPatients(page: number = 0, pageSize: number = 10): Promise<PaginatedResponse<Patient>> {
    if (USE_MOCK_DATA) {
      await delay();
      const start = page * pageSize;
      const end = start + pageSize;
      return {
        content: MOCK_PATIENTS.slice(start, end),
        totalElements: MOCK_PATIENTS.length,
        totalPages: Math.ceil(MOCK_PATIENTS.length / pageSize),
        currentPage: page,
        pageSize: pageSize,
        hasNext: end < MOCK_PATIENTS.length,
        hasPrevious: page > 0,
      };
    }

    const response = await httpClient.get<ApiResponse<PaginatedResponse<Patient>>>(
      `${API_CONFIG.ENDPOINTS.PATIENTS.LIST}?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  }

  /**
   * Get patient by ID
   */
  static async getPatientById(id: string): Promise<Patient> {
    if (USE_MOCK_DATA) {
      await delay();
      const patient = MOCK_PATIENTS.find((p) => p.id === id);
      if (!patient) throw new Error("Patient not found");
      return patient;
    }

    const response = await httpClient.get<ApiResponse<Patient>>(
      API_CONFIG.ENDPOINTS.PATIENTS.GET(id)
    );
    return response.data;
  }

  /**
   * Create new patient
   */
  static async createPatient(patientData: CreatePatientRequest): Promise<Patient> {
    if (USE_MOCK_DATA) {
      await delay();
      const newPatient: Patient = {
        id: `P-${Math.floor(Math.random() * 10000)}`,
        ...patientData,
        avatar: undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      MOCK_PATIENTS.push(newPatient);
      return newPatient;
    }

    const response = await httpClient.post<ApiResponse<Patient>>(
      API_CONFIG.ENDPOINTS.PATIENTS.CREATE,
      patientData
    );
    return response.data;
  }

  /**
   * Update patient
   */
  static async updatePatient(id: string, patientData: UpdatePatientRequest): Promise<Patient> {
    if (USE_MOCK_DATA) {
      await delay();
      const patientIndex = MOCK_PATIENTS.findIndex((p) => p.id === id);
      if (patientIndex === -1) throw new Error("Patient not found");
      MOCK_PATIENTS[patientIndex] = {
        ...MOCK_PATIENTS[patientIndex],
        ...patientData,
        updatedAt: new Date().toISOString(),
      };
      return MOCK_PATIENTS[patientIndex];
    }

    const response = await httpClient.put<ApiResponse<Patient>>(
      API_CONFIG.ENDPOINTS.PATIENTS.UPDATE(id),
      patientData
    );
    return response.data;
  }

  /**
   * Delete patient
   */
  static async deletePatient(id: string): Promise<void> {
    if (USE_MOCK_DATA) {
      await delay();
      const patientIndex = MOCK_PATIENTS.findIndex((p) => p.id === id);
      if (patientIndex === -1) throw new Error("Patient not found");
      MOCK_PATIENTS.splice(patientIndex, 1);
      return;
    }

    await httpClient.delete(
      API_CONFIG.ENDPOINTS.PATIENTS.DELETE(id)
    );
  }

  /**
   * Search patients
   */
  static async searchPatients(query: string): Promise<Patient[]> {
    if (USE_MOCK_DATA) {
      await delay();
      const lowerQuery = query.toLowerCase();
      return MOCK_PATIENTS.filter(
        (p) =>
          p.firstName.toLowerCase().includes(lowerQuery) ||
          p.lastName.toLowerCase().includes(lowerQuery) ||
          p.email.toLowerCase().includes(lowerQuery)
      );
    }

    const response = await httpClient.get<ApiResponse<Patient[]>>(
      `${API_CONFIG.ENDPOINTS.PATIENTS.SEARCH}?query=${encodeURIComponent(query)}`
    );
    return response.data;
  }
}
