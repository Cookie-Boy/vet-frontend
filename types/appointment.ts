export interface AppointmentRequest {
  clinicId: string;
  doctorId: string;
  patientId?: string;
  tgUserName?: string;
  startTime: string; // ISO datetime
  endTime: string;
  metadata?: Record<string, any>;
}

export interface AppointmentResponse {
  id: string;
  clinicId: string;
  clinicName?: string;
  doctorId: string;
  doctorFullName?: string;
  patientId?: string;
  patientFullName?: string;
  startTime: string;
  endTime: string;
  status: "BOOKED" | "CANCELLED" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}