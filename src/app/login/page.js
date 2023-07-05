"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import useSession from "@/lib/useSession";
import { mutate } from "swr";

export default function Login() {
  const { user } = useSession();
  const router = useRouter();

  useEffect(() => {
    if(user && user.isLoggedIn) {
      router.push("/");
    }
  }, [user]);

  const handleLoginSubmit = async e => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    const result = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
    const { success } = await result.json();

    if(success) {
      mutate("/api/session");
      router.push("/");
      router.refresh();
    } else {
      alert("hups");
    }
  }

  return (
    <div className="auth-page">
      <img width="100" height="100" src="/logo.png" style={{ marginBottom: 20, borderRadius: 6 }} />
      <h1>Kirjaudu</h1>

      <form onSubmit={e => handleLoginSubmit(e)}>
        <label>
          Sähköpostiosoite
          <input type="email" name="email" />
        </label>
        <label>
          Salasana
          <input type="password" name="password" />
        </label>

        <button type="submit">Kirjaudu sisään</button>
      </form>
    </div>
  )
}