/**
 * Mock Data - Static test data for development
 * Replace with real API calls when backend is ready
 */

import type { User, Patient, Team } from "@/models";
import { UserRole, Gender, TeamMemberRole } from "@/models";

/**
 * Mock Users Data
 */
export const MOCK_USERS: User[] = [
  {
    id: "USR001",
    firstName: "Sophie",
    lastName: "Bennett",
    email: "sophie@ui.live",
    phone: "+33 6 12 34 56 78",
    role: UserRole.ADMIN,
    department: "Administration",
    avatar: "https://i.pinimg.com/1200x/39/86/91/398691f123726a5763e9c47980964fff.jpg",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-03-10T15:30:00Z",
  },
  {
    id: "USR002",
    firstName: "Clara",
    lastName: "Lefèvre",
    email: "clara.lefevre@coconut.com",
    phone: "+33 6 98 76 54 32",
    role: UserRole.MANAGER,
    department: "R&D Product",
    avatar: "https://i.pinimg.com/736x/a2/f3/5c/a2f35c1d5d6e7f8g9h0i1j2k3l.jpg",
    createdAt: "2024-02-01T09:00:00Z",
    updatedAt: "2024-03-09T14:20:00Z",
  },
];

/**
 * Mock Patients Data
 */
export const MOCK_PATIENTS: Patient[] = [
  {
    id: "P-4392",
    firstName: "Jean-Pierre",
    lastName: "Durand",
    email: "jp.durand@email.com",
    phone: "+33 6 11 22 33 44",
    dateOfBirth: "1965-05-15",
    gender: Gender.MALE,
    address: "42 Rue de la Paix",
    city: "Lyon",
    country: "France",
    medicalHistory: "Hypertension, Type 2 Diabetes",
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-03-08T11:30:00Z",
  },
  {
    id: "P-8821",
    firstName: "Marie-Louise",
    lastName: "Petit",
    email: "ml.petit@email.com",
    phone: "+33 6 55 66 77 88",
    dateOfBirth: "1978-03-22",
    gender: Gender.FEMALE,
    address: "15 Boulevard Saint-Germain",
    city: "Paris",
    country: "France",
    medicalHistory: "Asthma, Allergies",
    createdAt: "2024-01-20T10:15:00Z",
    updatedAt: "2024-03-09T09:45:00Z",
  },
  {
    id: "P-1294",
    firstName: "Luc",
    lastName: "Moreau",
    email: "luc.moreau@email.com",
    phone: "+33 6 99 88 77 66",
    dateOfBirth: "1955-07-30",
    gender: Gender.MALE,
    address: "8 Rue des Fleurs",
    city: "Marseille",
    country: "France",
    medicalHistory: "Arthritis, High Cholesterol",
    createdAt: "2024-02-05T07:30:00Z",
    updatedAt: "2024-03-07T13:15:00Z",
  },
  {
    id: "P-7730",
    firstName: "Emma",
    lastName: "Dubois",
    email: "emma.dubois@email.com",
    phone: "+33 6 44 55 66 77",
    dateOfBirth: "1990-11-08",
    gender: Gender.FEMALE,
    address: "23 Avenue des Champs",
    city: "Toulouse",
    country: "France",
    medicalHistory: "Migraine, Anxiety",
    createdAt: "2024-02-15T14:00:00Z",
    updatedAt: "2024-03-06T10:20:00Z",
  },
];

/**
 * Mock Teams Data
 */
export const MOCK_TEAMS: Team[] = [
  {
    id: "TEAM001",
    name: "Medical Team A",
    description: "Primary care and cardiology specialists",
    members: [
      {
        id: "TM001",
        userId: "USR001",
        firstName: "Dr. Peter",
        lastName: "Griffin",
        email: "peter.griffin@coconut.com",
        role: TeamMemberRole.LEAD,
        joinedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "TM002",
        userId: "USR002",
        firstName: "Dr. Sophie",
        lastName: "Dubreuil",
        email: "sophie.dubreuil@coconut.com",
        role: TeamMemberRole.MEMBER,
        joinedAt: "2024-01-15T00:00:00Z",
      },
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-03-10T00:00:00Z",
  },
  {
    id: "TEAM002",
    name: "Dermatology Team",
    description: "Skin and dermatology specialists",
    members: [
      {
        id: "TM003",
        userId: "USR003",
        firstName: "Dr. Marc",
        lastName: "Aubert",
        email: "marc.aubert@coconut.com",
        role: TeamMemberRole.LEAD,
        joinedAt: "2024-02-01T00:00:00Z",
      },
    ],
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-03-10T00:00:00Z",
  },
];

/**
 * Simulate API delay
 */
export const delay = (ms: number = 500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
