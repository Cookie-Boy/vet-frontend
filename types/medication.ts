export interface MedicationRequest {
  name: string;
  description?: string;
  manufacturer: string;
  batchNumber: string;
  expiryDate: string; // YYYY-MM-DD
  quantityInStock: number;
  minStockLevel: number;
  reorderQuantity?: number;
  pricePerUnit: number;
  isPrescriptionOnly?: boolean;
}

export interface MedicationResponse {
  id: string;
  name: string;
  description?: string;
  manufacturer: string;
  batchNumber: string;
  expiryDate: string;
  quantityInStock: number;
  minStockLevel: number;
  reorderQuantity?: number;
  pricePerUnit: number;
  isPrescriptionOnly: boolean;
}