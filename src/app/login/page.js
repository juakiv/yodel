"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import useSession from "@/lib/useSession";

export default function Login() {
  const { user } = useSession();
  const router = useRouter();

  useEffect(() => {
    if(user && user.isLoggedIn) {
      router.push("/");
    }
  }, [user]);

  return (
    <>kirjautumissivu</>
  )
}