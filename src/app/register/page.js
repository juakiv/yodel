"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import useSession from "@/lib/useSession";

export default function Register() {
  const { user } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (user && user.isLoggedIn) {
      router.push("/");
    }
  }, [user]);

  const handleRegisterSubmit = async e => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const { email, password, password_again } = Object.fromEntries(formData);

    const result = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ email, password, password_again })
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
      <h1>Liity jäseneksi</h1>

      <form onSubmit={e => handleRegisterSubmit(e)}>
        <label>
          Sähköpostiosoite
          <input type="email" name="email" />
        </label>
        <label>
          Salasana
          <input type="password" name="password" />
        </label>
        <label>
          Salasana uudelleen
          <input type="password" name="password_again" />
        </label>

        <button type="submit">Luo tili</button>
      </form>
    </div>
  )
}