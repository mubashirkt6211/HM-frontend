import type { PatientRecord } from "./types";

export const patients: PatientRecord[] = [
  {
    id: "P-4392", name: "Jean-Pierre Durand", status: "Follow-up", appointment: "Today, 10:30", type: "Cardiology", subject: "Routine heart checkup", lastActivity: "Sep 12 at 09:10 AM", source: "Dribbble", createdAt: "1 month ago", age: 54, gender: "M", heartRate: 78, temp: 36.8, bp: "128/82", avatarColor: "from-blue-400 to-blue-600", avatar: "https://i.pinimg.com/736x/3f/62/bc/3f62bc68065763b72220779aaa14232e.jpg",
    documents: [
      { id: "DOC-001", name: "Blood Test Results", type: "Lab Result", date: "Mar 10, 2026", size: "1.2 MB" },
      { id: "DOC-002", name: "Cardiac MRI Scan", type: "Scan", date: "Feb 28, 2026", size: "15.4 MB" },
    ]
  },
  {
    id: "P-8821", name: "Marie-Louise Petit", status: "Emergency", appointment: "Today, 11:45", type: "Pediatrics", subject: "Post-surgery observation", lastActivity: "Sep 12 at 10:15 AM", source: "Instagram", createdAt: "2 months ago", age: 8, gender: "F", heartRate: 110, temp: 38.4, bp: "100/65", avatarColor: "from-rose-400 to-rose-600", avatar: "https://i.pinimg.com/1200x/66/94/c8/6694c81d4c094d2b65094287e094d54a.jpg",
    documents: [
      { id: "DOC-003", name: "Vaccination Record", type: "Report", date: "Jan 15, 2026", size: "0.8 MB" },
    ]
  },
  {
    id: "P-1294", name: "Luc Moreau", status: "Checkup", appointment: "Tomorrow, 09:00", type: "General", subject: "Annual physical exam", lastActivity: "Sep 12 at 11:20 AM", source: "Google", createdAt: "3 months ago", age: 34, gender: "M", heartRate: 65, temp: 36.5, bp: "118/76", avatarColor: "from-violet-400 to-violet-600", avatar: "https://i.pinimg.com/1200x/bf/30/fb/bf30fb033dbb732339ff3029556fd62e.jpg",
    documents: [
      { id: "DOC-004", name: "General Checkup Summary", type: "Report", date: "Dec 12, 2025", size: "2.1 MB" },
    ]
  },
  {
    id: "P-7730", name: "Emma Dubois", status: "Discharged", appointment: "Done", type: "Neurology", subject: "Post-migraine follow-up", lastActivity: "Sep 12 at 12:25 PM", source: "Facebook", createdAt: "4 months ago", age: 41, gender: "F", heartRate: 72, temp: 36.7, bp: "122/80", avatarColor: "from-emerald-400 to-emerald-600", avatar: "https://i.pinimg.com/474x/7b/df/c8/7bdfc8165947551dadbcd9ac99513775.jpg",
    documents: [
      { id: "DOC-005", name: "Neurology Exam", type: "Scan", date: "Mar 05, 2026", size: "12.0 MB" },
    ]
  },
  {
    id: "P-3318", name: "Antoine Bernard", status: "Scheduled", appointment: "Mar 16, 14:00", type: "Orthopedics", subject: "Knee injury consultation", lastActivity: "Sep 12 at 01:30 PM", source: "LinkedIn", createdAt: "5 months ago", age: 62, gender: "M", heartRate: 68, temp: 36.6, bp: "135/88", avatarColor: "from-orange-400 to-orange-600", avatar: "https://i.pravatar.cc/100?img=57",
    documents: []
  },
  {
    id: "P-5577", name: "Sophia Leclerc", status: "Follow-up", appointment: "Mar 15, 09:30", type: "Dermatology", subject: "Skin irritation follow-up", lastActivity: "Sep 12 at 02:35 PM", source: "LinkedIn", createdAt: "6 months ago", age: 29, gender: "F", heartRate: 70, temp: 36.4, bp: "112/72", avatarColor: "from-pink-400 to-pink-600", avatar: "https://i.pravatar.cc/100?img=41",
    documents: []
  },
  {
    id: "P-6612", name: "Hugo Fontaine", status: "Checkup", appointment: "Mar 17, 10:00", type: "Cardiology", subject: "Blood pressure monitor", lastActivity: "Sep 12 at 03:40 PM", source: "Google", createdAt: "7 months ago", age: 47, gender: "M", heartRate: 74, temp: 36.9, bp: "130/84", avatarColor: "from-cyan-400 to-cyan-600", avatar: "https://i.pravatar.cc/100?img=12",
    documents: []
  },
  {
    id: "P-9901", name: "Camille Rousseau", status: "Scheduled", appointment: "Mar 18, 08:30", type: "Pediatrics", subject: "Childhood vaccination", lastActivity: "Sep 12 at 04:45 PM", source: "Instagram", createdAt: "8 months ago", age: 6, gender: "F", heartRate: 95, temp: 37.0, bp: "95/60", avatarColor: "from-amber-400 to-amber-600", avatar: "https://i.pravatar.cc/100?img=36",
    documents: []
  },
  {
    id: "P-9901", name: "Ankara Messi", status: "Scheduled", appointment: "Mar 18, 08:30", type: "Pediatrics", subject: "Childhood vaccination", lastActivity: "Sep 12 at 04:45 PM", source: "Instagram", createdAt: "8 months ago", age: 6, gender: "F", heartRate: 95, temp: 37.0, bp: "95/60", avatarColor: "from-amber-400 to-amber-600", avatar: "https://i.pravatar.cc/100?img=36",
    documents: []
  },
];
