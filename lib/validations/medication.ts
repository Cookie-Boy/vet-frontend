// lib/validations/medication.ts
import { z } from "zod";

export const medicationFormSchema = z.object({
  clinicId: z.string().optional(),
  name: z.string().min(1, "Название обязательно"),
  description: z.string().optional(),
  manufacturer: z.string().min(1, "Производитель обязателен"),
  batchNumber: z.string().min(1, "Номер партии обязателен"),
  expiryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Формат ГГГГ-ММ-ДД"),
  quantityInStock: z.number().min(0, "Количество не может быть отрицательным"),
  minStockLevel: z.number().min(0, "Мин. остаток не может быть отрицательным"),
  reorderQuantity: z.number().min(0).optional(),
  pricePerUnit: z.number().min(0, "Цена не может быть отрицательной"),
  isPrescriptionOnly: z.boolean(),
});

export type MedicationFormValues = z.infer<typeof medicationFormSchema>;