import { useEffect } from "react";
import useSWR from "swr";

export default function useSession() {
  const { data: user } = useSWR("/api/session", url => fetch(url).then(r => r.json()));

  useEffect(() => {
    if(!user) return;

    if(!user.isLoggedIn) {
      console.log("Ei kirjautunu...");
    }
  }, [user]);

  return { user };
}