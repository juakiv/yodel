"use client";

import useSession from "@/lib/useSession";

export default function Login() {
  const { user } = useSession();

  return (
    <>kirjautumissivu</>
  )
}