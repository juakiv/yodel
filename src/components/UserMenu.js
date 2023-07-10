"use client";

import useSession from "@/lib/useSession";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import { mutate } from "swr";

export default function UserMenu() {
  const { user } = useSession();

  const [loggingOut, setLoggingOut] = useState(false);

  const logout = async () => {
    if(loggingOut) return false;

    setLoggingOut(true);

    const logoutReq = await fetch("/api/logout", { method: "POST" });
    const { success } = await logoutReq.json();

    if(success) {
      mutate("/api/session");
    } else {
      toast("Uloskirjautuminen epäonnistui.", { theme: "dark", autoClose: 5000, position: "top-center" });
    }
    setLoggingOut(false);
  }

  return (
    <div className="user-menu">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" /></svg>
      <div className="user-menu-dropdown">
        {user && user.isLoggedIn &&<>
          <Link href="/settings">Asetukset</Link>
          <a onClick={() => logout()}>
            {loggingOut ? <div className="loading-icon"></div> : "Kirjaudu ulos"}
          </a>
        </>}
        {user && !user.isLoggedIn &&<>
        <Link href="/login">Kirjaudu sisään</Link>
        <Link href="/register">Luo tili</Link>
        </>}
      </div>
    </div>
  )
}