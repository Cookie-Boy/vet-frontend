"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DoctorResponse, Specialization, DoctorRequest, getSpecializationLabel } from "@/types/doctor";
import { useCreateDoctor, useUpdateDoctor } from "@/hooks/useDoctors";
import { useUserSearch, UserSearchResult } from "@/hooks/useUserSearch";
import { useClinics } from "@/hooks/useClinics"; // <-- новый импорт
import { debounce } from "lodash";

// Добавлено поле clinicId (опционально)
const doctorFormSchema = z.object({
  userId: z.string().min(1, "Пользователь не выбран"),
  specialization: z.nativeEnum(Specialization),
  licenseNumber: z.string().min(1, "Номер лицензии обязателен"),
  startWorkingDay: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, "Формат ЧЧ:ММ:СС"),
  endWorkingDay: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, "Формат ЧЧ:ММ:СС"),
  bio: z.string().optional(),
  clinicId: z.string().optional(), // <-- новое поле
});

type DoctorFormValues = z.infer<typeof doctorFormSchema>;

interface AddDoctorFormProps {
  initialData?: DoctorResponse;
}

export function AddDoctorForm({ initialData }: AddDoctorFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(
    initialData
      ? {
          id: initialData.id,
          email: initialData.email,
          firstName: initialData.firstName,
          lastName: initialData.lastName,
          phone: initialData.phoneNumber,
        }
      : null
  );

  const { data: searchResults = [], isFetching } = useUserSearch(debouncedSearch);
  const { data: clinics = [] } = useClinics(); // <-- получаем список клиник

  const createDoctor = useCreateDoctor();
  const updateDoctor = useUpdateDoctor(initialData?.id || "");

  const form = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      userId: initialData?.id || "",
      specialization: initialData?.specialization || Specialization.GENERAL_PRACTITIONER,
      licenseNumber: initialData?.licenseNumber || "",
      startWorkingDay: initialData?.startWorkingDay || "09:00:00",
      endWorkingDay: initialData?.endWorkingDay || "18:00:00",
      bio: initialData?.bio || "",
      clinicId: initialData?.clinicId || "", // <-- предзаполнение
    },
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch } = form;
  
  const selectedSpecialization = watch("specialization");
  const selectedClinicId = watch("clinicId");
  const selectedClinic = clinics.find(c => c.id === selectedClinicId);

  // Debounce поиска
  const debouncedSearchFn = useCallback(
    debounce((value: string) => {
      setDebouncedSearch(value);
    }, 300),
    []
  );

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchInput(val);
    debouncedSearchFn(val);
  };

  const selectUser = (user: UserSearchResult) => {
    setSelectedUser(user);
    setValue("userId", user.id);
    setSearchInput("");
    setDebouncedSearch("");
  };

  const onSubmit = async (values: DoctorFormValues) => {
    if (!selectedUser) {
      toast.error("Выберите пользователя");
      return;
    }

    setIsLoading(true);
    try {
      const payload: DoctorRequest = {
        id: values.userId,
        firstName: selectedUser.firstName || selectedUser.email,
        lastName: selectedUser.lastName || "",
        email: selectedUser.email,
        specialization: values.specialization,
        licenseNumber: values.licenseNumber,
        phoneNumber: selectedUser.phone || "",
        hireDate: new Date().toISOString().split("T")[0],
        startWorkingDay: values.startWorkingDay,
        endWorkingDay: values.endWorkingDay,
        bio: values.bio,
        clinicId: values.clinicId || undefined, // <-- передаём, если выбрана
      };
      if (initialData) {
        await updateDoctor.mutateAsync(payload);
        toast.success("Данные врача обновлены");
      } else {
        await createDoctor.mutateAsync(payload);
        toast.success("Врач добавлен.");
      }
      router.push("/doctors");
      router.refresh();
    } catch (error) {
      toast.error("Не удалось сохранить данные");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
      <Card>
        <CardHeader><CardTitle>Поиск пользователя</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {/* ... тот же поиск, что и был ... */}
          <div className="relative">
            <Input
              placeholder="Введите email или имя пользователя"
              value={searchInput}
              onChange={handleSearchInput}
            />
            {isFetching && <div className="absolute right-3 top-3 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />}
          </div>
          {debouncedSearch.length >= 2 && searchResults.length > 0 && (
            <ul className="border rounded-md max-h-40 overflow-y-auto">
              {searchResults.map((user) => (
                <li
                  key={user.id}
                  className="p-2 hover:bg-muted cursor-pointer flex justify-between items-center"
                  onClick={() => selectUser(user)}
                >
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.firstName} {user.lastName} {user.phone && `· ${user.phone}`}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">Выбрать</Button>
                </li>
              ))}
            </ul>
          )}
          {selectedUser && (
            <div className="p-3 bg-muted rounded-md">
              <p className="font-medium">Выбран: {selectedUser.email}</p>
              <p className="text-sm text-muted-foreground">
                {selectedUser.firstName} {selectedUser.lastName} {selectedUser.phone && `· ${selectedUser.phone}`}
              </p>
            </div>
          )}
          <input type="hidden" {...register("userId")} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Профессиональные данные</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="specialization">Специализация *</Label>
              <Select 
                value={selectedSpecialization}
                onValueChange={(val) => setValue("specialization", val as Specialization)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите специализацию">
                    {selectedSpecialization && getSpecializationLabel(selectedSpecialization)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Specialization).map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {getSpecializationLabel(spec)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.specialization && <p className="text-sm text-destructive">{errors.specialization.message}</p>}
            </div>
            <div>
              <Label htmlFor="licenseNumber">Номер лицензии *</Label>
              <Input id="licenseNumber" {...register("licenseNumber")} />
              {errors.licenseNumber && <p className="text-sm text-destructive">{errors.licenseNumber.message}</p>}
            </div>
            <div>
              <Label htmlFor="startWorkingDay">Начало рабочего дня *</Label>
              <Input id="startWorkingDay" type="time" step="1" {...register("startWorkingDay")} />
              {errors.startWorkingDay && <p className="text-sm text-destructive">{errors.startWorkingDay.message}</p>}
            </div>
            <div>
              <Label htmlFor="endWorkingDay">Конец рабочего дня *</Label>
              <Input id="endWorkingDay" type="time" step="1" {...register("endWorkingDay")} />
              {errors.endWorkingDay && <p className="text-sm text-destructive">{errors.endWorkingDay.message}</p>}
            </div>
            {/* Новый блок выбора клиники */}
            <div>
              <Label htmlFor="clinicId">Клиника</Label>
              <Select 
                value={selectedClinicId || "Отсутствует"}
                onValueChange={(val) => setValue("clinicId", val === "Отсутствует" || val == null ? undefined : val)}
              >
                <SelectTrigger className="w-64">
                  <SelectValue>
                      {selectedClinic ? selectedClinic.name : "Выберите клинику"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Отсутствует">Без клиники</SelectItem>
                  {clinics.map((clinic) => (
                    <SelectItem key={clinic.id} value={clinic.id}>{clinic.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.clinicId && <p className="text-sm text-destructive">{errors.clinicId.message}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="bio">Биография / О себе</Label>
            <Textarea id="bio" {...register("bio")} rows={4} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>Отмена</Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Сохранение..." : (initialData ? "Обновить" : "Назначить врачом")}
        </Button>
      </div>
    </form>
  );
}