// app/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import LoadingRedirect from "@/components/LoadingRedirect";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  
  if (session) {
    return <LoadingRedirect to="/dashboard" delay={1500} />;
  } else {
    redirect("/login");
  }
}