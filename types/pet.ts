export interface VaccinationDto {
  name: string;
  date: string; // ISO date
  nextDueDate: string; // ISO date
}

export interface MedicalRecordDto {
  vaccinations?: VaccinationDto[];
  allergies?: string[];
  chronicDiseases?: string[];
}

export interface HomeInfoDto {
  alerting: boolean;
  radius: number; // meters
  lat: number;
  lon: number;
}

export interface CollarDto {
  active: boolean;
  homeInfo?: HomeInfoDto;
}

export interface PetRequest {
  ownerId: string;
  species: string;
  age: number;
  breed: string;
  chipNumber?: string;
  medicalRecord?: MedicalRecordDto;
  collar?: CollarDto;
}

export interface PetResponse {
  id: string;
  ownerId: string;
  species: string;
  age: number;
  breed: string;
  chipNumber?: string;
  qrCode: string;
  medicalRecord?: MedicalRecordDto;
  collar?: CollarDto;
}

export interface OwnerRequest {
  id: string;
  tgChatId?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface OwnerResponse {
  id: string;
  tgChatId?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}