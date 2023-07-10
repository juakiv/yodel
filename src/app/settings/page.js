"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import useSession from "@/lib/useSession"
import { toast } from "react-toastify";
import { mutate } from "swr";

export default function Settings() {
  const { user } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [changingEmail, setChangingEmail] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [loggingOutSession, setLoggingOutSession] = useState(false);

  const updateEmail = async e => {
    e.preventDefault();

    if (changingEmail) return false;

    setChangingEmail(true);

    const req = await fetch("/api/settings/email", {
      method: "POST",
      body: JSON.stringify({ email })
    });
    const { success, message } = await req.json();

    setChangingEmail(false);
    setEmail("");

    if (success) {
      mutate("/api/session");
      toast("Sähköpostiosoite päivitetty onnistuneesti.", { theme: "dark", autoClose: 5000, position: "top-center" });
    } else {
      toast(message, { theme: "dark", autoClose: 5000, position: "top-center" });
    }
  }

  const updatePassword = async e => {
    e.preventDefault();
    if (changingPassword) return false;

    setChangingPassword(true);

    const req = await fetch("/api/settings/password", {
      method: "POST",
      body: JSON.stringify({ current_password: currentPassword, password, password_again: passwordAgain })
    });
    const { success, message } = await req.json();

    setChangingPassword(false);
    if (success) {
      setCurrentPassword("");
      setPassword("");
      setPasswordAgain("");
      toast("Salasana vaihdettu onnistuneesti.", { theme: "dark", autoClose: 5000, position: "top-center" });
    } else {
      toast(message, { theme: "dark", autoClose: 5000, position: "top-center" });
    }
  }
  
  const getSessions = async () => {
    const req = await fetch("/api/settings/sessions");
    const loadedSessions = await req.json();
    
    setSessions(loadedSessions);
    setSessionsLoading(false);
  }
  
  const logOutSession = async id => {
    if(loggingOutSession) return false;
    setLoggingOutSession(true);
    
    const req = await fetch("/api/settings/sessions", {
      method: "POST",
      body: JSON.stringify({ id })
    });
    const { success, message, session } = await req.json();
    
    setLoggingOutSession(false);

    if(success) {
      setSessions(currentSessions => currentSessions.filter(currentSession => currentSession.id !== session));
      toast("Sessio suljettiin onnistuneesti.", { theme: "dark", autoClose: 5000, position: "top-center" });
    } else {
      toast(message, { theme: "dark", autoClose: 5000, position: "top-center" });
    }
  }

  useEffect(() => {
    if (user && !user.isLoggedIn) {
      router.push("/");
    } else if (user && user.isLoggedIn) {
      getSessions();
    }
  }, [user]);
  if (!user) return <></>

  return (
    <div className="settings-page">
      <h1>Asetukset</h1>

      <h3>Sähköpostiosoite</h3>
      <p>Nykyinen sähköpostiosoitteesi on {user.email}</p>

      <form onSubmit={e => updateEmail(e)}>
        <label>
          Uusi sähköpostiosoite
          <input type="email" name="email" onChange={e => setEmail(e.target.value)} value={email} />
        </label>
        {changingEmail ?
          <button type="submit" disabled><div className="loading-icon loading-icon--button"></div> Tallenna</button>
          :
          <button type="submit">Tallenna</button>
        }
      </form>
      <h3>Salasana</h3>
      <form onSubmit={e => updatePassword(e)}>
        <label>
          Nykyinen salasana
          <input type="password" name="current_password" onChange={e => setCurrentPassword(e.target.value)} value={currentPassword} />
        </label>
        <label>
          Uusi salasana
          <input type="password" name="password" onChange={e => setPassword(e.target.value)} value={password} />
        </label>
        <label>
          Uusi salasana uudelleen
          <input type="password" name="password_again" onChange={e => setPasswordAgain(e.target.value)} value={passwordAgain} />
        </label>
        {changingPassword ?
          <button type="submit" disabled><div className="loading-icon loading-icon--button"></div> Vaihda salasana</button>
          :
          <button type="submit">Vaihda salasana</button>
        }
      </form>

      <h3>Aktiiviset sessiot</h3>
      {sessionsLoading && <div className="infinite-loading-icon">
        <div className="loading-icon-holder">
          <div className="loading-icon"></div>
        </div>
      </div>}
      {sessions.map(session =>
        <div className="session">
          <div className="session-data">
            <span>{session.current ? "Nykyinen sessio" : "Muu sessio"}</span>
            Viimeksi nähty {new Intl.DateTimeFormat("fi-FI", {
                month: "numeric",
                day: "numeric",
                year: "numeric"
              }).format(new Date(session.lastSeen))} kello {new Intl.DateTimeFormat("fi-FI", {
                hour: "numeric",
                minute: "numeric"
              }).format(new Date(session.lastSeen))}
          </div>
          {!session.current && <>
            {loggingOutSession ?
            <button disabled><div className="loading-icon loading-icon--button"></div></button>
            :
            <button onClick={() => logOutSession(session.id)}>Kirjaa ulos</button>
            }
          </>}
        </div>
      )}
    </div>
  )
}