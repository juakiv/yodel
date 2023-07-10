"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { mutate } from "swr";

import useSession from "@/lib/useSession";

export default function Register() {
  const { user } = useSession();
  const router = useRouter();

  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (user && user.isLoggedIn) {
      router.push("/");
    }
  }, [user]);

  const handleRegisterSubmit = async e => {
    e.preventDefault();
    if (isRegistering) return false;
    setIsRegistering(true);

    const formData = new FormData(e.target);
    const { email, password, password_again } = Object.fromEntries(formData);

    const result = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ email, password, password_again })
    });
    const { success, message } = await result.json();

    if (success) {
      mutate("/api/session");
      router.push("/");
      router.refresh();
    } else {
      toast(message, { theme: "dark", autoClose: 5000, position: "top-center" });
      setIsRegistering(false);
    }
  }

  return (
    <div className="auth-page">
      <img alt="logo" width="100" height="100" src="/logo.png" style={{ marginBottom: 20, borderRadius: 6 }} />
      <h1>Liity jäseneksi</h1>

      <form onSubmit={e => handleRegisterSubmit(e)}>
        <label>
          Sähköpostiosoite
          <input type="email" name="email" required />
        </label>
        <label>
          Salasana
          <input type="password" name="password" required />
        </label>
        <label>
          Salasana uudelleen
          <input type="password" name="password_again" required />
        </label>

        {isRegistering ?
          <button type="submit" disabled><div className="loading-icon loading-icon--button"></div> Luo tili</button>
          :
          <button type="submit">Luo tili</button>
        }
      </form>
    </div>
  )
}