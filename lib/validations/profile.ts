import { z } from "zod";

export const profileFormSchema = z.object({
  firstName: z.string().min(1, "Имя обязательно").max(100),
  lastName: z.string().min(1, "Фамилия обязательна").max(100),
  phone: z.string().regex(/^\+?[0-9\s\-\(\)]{10,20}$/, "Некорректный формат телефона"),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;