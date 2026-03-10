/**
 * Patient Model
 */
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: Gender;
  address?: string;
  city?: string;
  country?: string;
  avatar?: string;
  medicalHistory?: string;
  createdAt: string;
  updatedAt: string;
}

export const Gender = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
} as const;

export type Gender = typeof Gender[keyof typeof Gender];

/**
 * Patient request for creation/update
 */
export interface CreatePatientRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: Gender;
  address?: string;
  city?: string;
  country?: string;
}

export interface UpdatePatientRequest extends Partial<CreatePatientRequest> {}
