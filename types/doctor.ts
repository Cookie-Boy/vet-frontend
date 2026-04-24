export interface Review {
  id: string;
  doctorId: string;
  authorName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface CreateReviewRequest {
  doctorId: string;
  authorName: string;
  rating: number;
  comment: string;
}

export enum Specialization {
  THERAPIST = "THERAPIST",
  CARDIOLOGIST = "CARDIOLOGIST",
  NEUROLOGIST = "NEUROLOGIST",
  PEDIATRICIAN = "PEDIATRICIAN",
  SURGEON = "SURGEON",
  OPHTHALMOLOGIST = "OPHTHALMOLOGIST",
  DERMATOLOGIST = "DERMATOLOGIST",
  PSYCHIATRIST = "PSYCHIATRIST",
  GYNECOLOGIST = "GYNECOLOGIST",
  UROLOGIST = "UROLOGIST",
  ENDOCRINOLOGIST = "ENDOCRINOLOGIST",
  ONCOLOGIST = "ONCOLOGIST",
  RADIOLOGIST = "RADIOLOGIST",
  PATHOLOGIST = "PATHOLOGIST",
  ANESTHESIOLOGIST = "ANESTHESIOLOGIST",
}

export interface DoctorRequest {
  firstName: string;
  lastName: string;
  middleName?: string;
  specialization: Specialization;
  licenseNumber: string;
  phoneNumber: string;
  email: string;
  hireDate: string; // YYYY-MM-DD
  startWorkingDay: string; // HH:mm:ss
  endWorkingDay: string; // HH:mm:ss
  bio?: string;
}

export interface DoctorResponse {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  specialization: Specialization;
  licenseNumber: string;
  phoneNumber: string;
  email: string;
  hireDate: string;
  startWorkingDay: string;
  endWorkingDay: string;
  bio?: string;
}