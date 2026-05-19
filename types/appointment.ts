export interface AppointmentRequest {
  doctorId: string;
  ownerId: string;
  petId: string;
  startTime: string;
  endTime: string;
  metadata?: Record<string, any>;
}

export interface AppointmentResponse {
  id: string;
  doctorId: string;
  doctorFullName?: string;
  ownerId: string;
  ownerFullName?: string;
  petId: string;
  petFullName?: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "CANCELLED" | "CONFIRMED";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}