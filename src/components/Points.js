"use client";

import useSession from "@/lib/useSession";

export default function Points() {
  const { user } = useSession();

  if(!user || (user && !user.isLoggedIn)) {
    return <></>
  }

  return (
    <div className="user-points">
      <span>{user.points}</span>
      PISTEET
    </div>
  )
}