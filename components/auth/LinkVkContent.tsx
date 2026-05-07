// components/auth/LinkVkContent.tsx
"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface LinkVkContentProps {
  token: string;
  initialSession: any;
}

export function LinkVkContent({ token, initialSession }: LinkVkContentProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLinking, setIsLinking] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);

  // Объединяем начальную сессию и актуальную
  const currentSession = session ?? initialSession;

  const handleLink = async () => {
    if (!currentSession?.user?.id) {
      toast.error("Не удалось получить ID пользователя");
      return;
    }

    setIsLinking(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/profile/owners/${currentSession.user.id}/link-vk`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentSession.accessToken}`,
          },
          body: JSON.stringify({ token }),
        }
      );

      if (response.ok) {
        setResult("success");
        toast.success("VK аккаунт успешно привязан!");
      } else {
        const errorData = await response.json().catch(() => ({ message: "Ошибка привязки" }));
        setResult("error");
        toast.error(errorData.message || "Не удалось привязать VK");
      }
    } catch (error) {
      setResult("error");
      toast.error("Сетевая ошибка при привязке");
    } finally {
      setIsLinking(false);
    }
  };

  // Если сессия загружается, показываем спиннер
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Если не авторизован – предлагаем войти
  if (!currentSession) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Привязка VK</CardTitle>
            <CardDescription>
              Для привязки аккаунта ВКонтакте необходимо авторизоваться в системе.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Button onClick={() => signIn("keycloak", { callbackUrl: `/link-vk?token=${token}` })} className="w-full">
              <LogIn className="mr-2 h-4 w-4" />
              Войти через платформу
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Авторизован – выполняем привязку автоматически при первой загрузке (если ещё не пробовали)
  // или показываем кнопку, если нужен явный клик
  if (!result && !isLinking) {
    // Можно сразу запустить привязку, но лучше дать пользователю подтвердить
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Привязка VK</CardTitle>
            <CardDescription>
              Вы авторизованы как {currentSession.user?.name || currentSession.user?.email}.<br />
              Нажмите кнопку, чтобы привязать ваш аккаунт ВКонтакте.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Button onClick={handleLink} disabled={isLinking} className="w-full">
              {isLinking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Привязка...
                </>
              ) : (
                "Привязать VK"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Результат
  if (result === "success") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-2" />
            <CardTitle>Готово!</CardTitle>
            <CardDescription>
              Ваш аккаунт ВКонтакте успешно привязан. Можете закрыть эту страницу и возвращаться к боту.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (result === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <XCircle className="mx-auto h-12 w-12 text-destructive mb-2" />
            <CardTitle>Ошибка</CardTitle>
            <CardDescription>
              Не удалось привязать VK. Возможно, токен устарел или уже использован.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/")}>На главную</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}