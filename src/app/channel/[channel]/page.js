"use client";

import PostsList from "@/components/PostsList";

export default function Channel({ params }) {
  return (
    <PostsList channel={params.channel} />
  )
}