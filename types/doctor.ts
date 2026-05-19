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
  GENERAL_PRACTITIONER = "GENERAL_PRACTITIONER",
  SURGEON = "SURGEON",
  DENTIST = "DENTIST",
  DERMATOLOGIST = "DERMATOLOGIST",
  OPHTHALMOLOGIST = "OPHTHALMOLOGIST",
  CARDIOLOGIST = "CARDIOLOGIST",
  ONCOLOGIST = "ONCOLOGIST",
  EXOTIC_PETS = "EXOTIC_PETS",
  FELINE = "FELINE",
  CANINE = "CANINE",
}

export const SpecializationLabels: Record<Specialization, string> = {
  [Specialization.GENERAL_PRACTITIONER]: "Терапевт",
  [Specialization.SURGEON]: "Хирург",
  [Specialization.DENTIST]: "Стоматолог",
  [Specialization.DERMATOLOGIST]: "Дерматолог",
  [Specialization.OPHTHALMOLOGIST]: "Офтальмолог",
  [Specialization.CARDIOLOGIST]: "Кардиолог",
  [Specialization.ONCOLOGIST]: "Онколог",
  [Specialization.EXOTIC_PETS]: "Экзотические животные",
  [Specialization.FELINE]: "Кошки",
  [Specialization.CANINE]: "Собаки",
};

// Вспомогательные функции
export const getSpecializationLabel = (specialization: Specialization): string => {
  return SpecializationLabels[specialization] || specialization;
};

// Для преобразования из строки с бэка в enum
export const parseSpecialization = (value: string): Specialization => {
  return Specialization[value as keyof typeof Specialization];
};

export interface DoctorRequest {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  specialization: Specialization;
  licenseNumber: string;
  phoneNumber: string;
  hireDate: string;
  startWorkingDay: string;
  endWorkingDay: string;
  bio?: string;
}

export interface DoctorResponse {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  specialization: Specialization;
  licenseNumber: string;
  phoneNumber: string;
  hireDate: string;
  startWorkingDay: string;
  endWorkingDay: string;
  bio?: string;
}