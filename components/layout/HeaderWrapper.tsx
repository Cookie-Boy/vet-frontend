// components/layout/HeaderWrapper.tsx
"use client";

import { useSession } from "next-auth/react";
import Header from "./Header";

export default function HeaderWrapper() {
  const { status } = useSession();
  console.log("HeaderWrapper working...");
  return <Header key={status} />;
}