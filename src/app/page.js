"use client";

import NewPost from "@/components/NewPost";
import Points from "@/components/Points";

export default function Home() {
  return (
    <>
      <div className="header">
        <Points />
      </div>
      <NewPost />
    </>
  )
}
