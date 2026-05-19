export interface VaccinationDto {
  name: string;
  date: string;
  nextDueDate: string;
}

export interface MedicalRecordDto {
  vaccinations?: VaccinationDto[];
  allergies?: string[];
  chronicDiseases?: string[];
}

export interface HomeInfoDto {
  alerting: boolean;
  radius: number;
  lat: number;
  lon: number;
}

export interface CollarDto {
  active: boolean;
  homeInfo?: HomeInfoDto;
}

export interface PetRequest {
  ownerId: string;
  name: string;
  species: "cat" | "dog";
  age: number;
  breed: string;
  chipNumber?: string;
  medicalRecord?: MedicalRecordDto;
  collar?: CollarDto;
}

export interface PetResponse {
  id: string;
  ownerId: string;
  name: string;
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
  vkUserId?: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface OwnerResponse {
  id: string;
  vkUserId?: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}