// app/link-vk/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { LinkVkContent } from "@/components/auth/LinkVkContent";

interface LinkVkPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function LinkVkPage({ searchParams }: LinkVkPageProps) {
  const session = await getServerSession(authOptions);
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Ошибка</h1>
          <p className="text-muted-foreground">Отсутствует токен привязки.</p>
        </div>
      </div>
    );
  }

  return <LinkVkContent token={token} initialSession={session} />;
}