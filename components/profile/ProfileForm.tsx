// frontend/components/profile/ProfileForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileFormSchema, type ProfileFormValues } from "@/lib/validations/profile";
import { profileApi } from "@/lib/api/profile";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { OwnerResponse } from "@/types/pet";

interface ProfileFormProps {
  initialData?: OwnerResponse;
  userId: string;
}

export default function ProfileForm({ initialData, userId }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      phone: initialData?.phone || "",
    },
  });

  async function onSubmit(values: ProfileFormValues) {
    setIsLoading(true);
    try {
      await profileApi.updateOwner(userId, {
        id: userId,
        ...values,
        vkUserId: initialData?.vkUserId,
      });
      toast.success("Профиль успешно обновлён");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Не удалось обновить профиль");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Личные данные</CardTitle>
          <CardDescription>
            Обновите вашу контактную информацию
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя</FormLabel>
                    <FormControl>
                      <Input placeholder="Иван" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Фамилия</FormLabel>
                    <FormControl>
                      <Input placeholder="Петров" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Телефон</FormLabel>
                    <FormControl>
                      <Input placeholder="+7 (495) 123-45-67" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Сохранить изменения
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Интеграция с ВКонтакте</CardTitle>
          <CardDescription>
            Статус подключения VK-бота
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">
              VK ID
            </div>
            <div className="flex items-center gap-2">
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                {initialData?.vkUserId || "Не привязан"}
              </code>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {initialData?.vkUserId 
                ? "Бот активен. Вы будете получать уведомления в Telegram."
                : "Перейдите в сообщество и отправьте команду /start для привязки."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}