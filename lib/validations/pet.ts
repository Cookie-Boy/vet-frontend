// lib/validations/pet.ts
import { z } from "zod";

const vaccinationSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Неверный формат даты"),
  nextDueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Неверный формат даты"),
});

const medicalRecordSchema = z.object({
  vaccinations: z.array(vaccinationSchema).optional(),
  allergies: z.array(z.string()).optional(),
  chronicDiseases: z.array(z.string()).optional(),
});

const homeInfoSchema = z.object({
  alerting: z.boolean(),
  radius: z.number().min(10, "Минимальный радиус 10 м"),
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
});

const collarSchema = z.object({
  active: z.boolean(),
  homeInfo: homeInfoSchema.optional(),
});


export const petFormSchema = z.object({
  ownerId: z.string(),
  name: z.string().min(1, "Имя обязательно"),
  species: z.enum(["cat", "dog"]),
  age: z.number().min(0, "Возраст не может быть отрицательным").max(50, "Слишком большой возраст"),
  breed: z.string().min(1, "Порода обязательна"),
  chipNumber: z.string().optional(),
  medicalRecord: medicalRecordSchema.optional(),
  collar: collarSchema.optional(),
});

export type PetFormValues = z.infer<typeof petFormSchema>;