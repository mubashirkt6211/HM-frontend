export interface PatientRecord {
  id: string;
  name: string;
  status: "Follow-up" | "Emergency" | "Checkup" | "Discharged" | "Scheduled";
  appointment: string;
  type: string;
  subject: string;
  lastActivity: string;
  source: "Google" | "Facebook" | "Instagram" | "LinkedIn" | "Dribbble" | "Direct";
  createdAt: string;
  age: number;
  gender: "M" | "F";
  heartRate: number;
  temp: number;
  bp: string;
  avatarColor: string;
  avatar: string;
  documents: {
    id: string;
    name: string;
    type: "Report" | "Scan" | "Prescription" | "Lab Result";
    date: string;
    size: string;
  }[];
}
