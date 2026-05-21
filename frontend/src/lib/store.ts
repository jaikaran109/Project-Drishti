// Simple localStorage-backed mock data store for appointments
export type AppStatus = "Pending" | "Approved" | "Rejected";
export type Application = {
  id: string;
  patientName: string;
  phone: string;
  problem: string;
  details: string;
  previousTreatment?: string;
  reportName?: string;
  status: AppStatus;
  createdAt: string;
  appointmentDate?: string;
  appointmentTime?: string;
  queueNumber?: number;
  rejectReason?: string;
};

const KEY = "drishti_applications";

const seed: Application[] = [
  {
    id: "APP12345",
    patientName: "Ravi Kumar",
    phone: "9876543210",
    problem: "Blurry vision",
    details: "Blurry vision from last 2 months, water in eyes and headache.",
    status: "Pending",
    createdAt: "2026-05-21",
  },
  {
    id: "APP12346",
    patientName: "Sita Devi",
    phone: "9123456780",
    problem: "Eye redness",
    details: "Frequent redness and itching for past week.",
    status: "Pending",
    createdAt: "2026-05-21",
  },
  {
    id: "APP12347",
    patientName: "Mohan Lal",
    phone: "9988776655",
    problem: "Cataract check",
    details: "Old age, cloudy vision in right eye.",
    status: "Approved",
    createdAt: "2026-05-20",
    appointmentDate: "2026-05-29",
    appointmentTime: "11:00 AM",
    queueNumber: 12,
  },
  {
    id: "APP12348",
    patientName: "Ramesh Singh",
    phone: "8877665544",
    problem: "Incomplete info",
    details: "—",
    status: "Rejected",
    createdAt: "2026-05-20",
    rejectReason: "Incomplete information provided.",
  },
];

export function getApplications(): Application[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw);
  } catch {
    return seed;
  }
}

export function saveApplications(apps: Application[]) {
  localStorage.setItem(KEY, JSON.stringify(apps));
}

export function addApplication(a: Omit<Application, "id" | "createdAt" | "status">): Application {
  const apps = getApplications();
  const id = "APP" + Math.floor(10000 + Math.random() * 90000);
  const created: Application = {
    ...a,
    id,
    status: "Pending",
    createdAt: new Date().toISOString().slice(0, 10),
  };
  apps.unshift(created);
  saveApplications(apps);
  return created;
}

export function updateApplication(id: string, patch: Partial<Application>) {
  const apps = getApplications().map((x) => (x.id === id ? { ...x, ...patch } : x));
  saveApplications(apps);
  return apps;
}
