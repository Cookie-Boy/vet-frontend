// app/profile/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation";
import { profileApi } from '@/lib/api/profile';
import ProfileForm from "@/components/profile/ProfileForm";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id || !session?.accessToken || !session?.refreshToken) {
    redirect("/login");
  }

  let ownerData;
  let error;

  try {
    ownerData = await profileApi.getOwner(session.user.id);
  } catch (err) {
    error = "Не удалось загрузить данные профиля. Возможно, профиль ещё не создан.";
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Профиль</h1>
        <p className="text-muted-foreground mt-1">
          Управление вашими персональными данными и настройками
        </p>
      </div>

      {error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          {error}
        </div>
      ) : (
        <ProfileForm initialData={ownerData} userId={session.user.id} />
      )}
    </div>
  );
}