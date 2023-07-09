"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { mutate } from "swr";
import { toast } from "react-toastify";

import useSession from "@/lib/useSession";

export default function Login() {
  const { user } = useSession();
  const router = useRouter();

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (user && user.isLoggedIn) {
      router.push("/");
    }
  }, [user]);

  const handleLoginSubmit = async e => {
    e.preventDefault();
    if (isLoggingIn) return false;

    setIsLoggingIn(true);

    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    const result = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
    const { success, message } = await result.json();

    if (success) {
      mutate("/api/session");
      router.push("/");
      router.refresh();
    } else {
      toast(message, { theme: "dark", autoClose: 5000, position: "top-center" });
      setIsLoggingIn(false);
    }
  }

  return (
    <div className="auth-page">
      <img width="100" height="100" src="/logo.png" style={{ marginBottom: 20, borderRadius: 6 }} />
      <h1>Kirjaudu</h1>

      <form onSubmit={e => handleLoginSubmit(e)}>
        <label>
          Sähköpostiosoite
          <input type="email" name="email" required />
        </label>
        <label>
          Salasana
          <input type="password" name="password" required />
        </label>

        {isLoggingIn ?
          <button type="submit" disabled><div className="loading-icon loading-icon--button"></div> Kirjaudu sisään</button>
          :
          <button type="submit">Kirjaudu sisään</button>
        }
      </form>
    </div>
  )
}