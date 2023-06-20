"use client";

import useSession from "@/lib/useSession";

export default function Points() {
  const { user } = useSession();
  return (
    <div className="user-points">
      {user && "points" in user ? <span>{user.points}</span> : <span>pöö</span>}
      PISTEET
    </div>
  )
}