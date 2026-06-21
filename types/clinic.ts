export interface ClinicRequest {
  name: string;
  address: string;
  phone: string;
}

export interface ClinicResponse {
  id: string;        // UUID
  name: string;
  address: string;
  phone: string;
}