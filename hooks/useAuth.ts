import { useSession } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();
  
  return {
    session,
    status,
    user: session?.user,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    userId: session?.user?.id,
    accessToken: session?.accessToken,
  };
}