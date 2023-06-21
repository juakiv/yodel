"use client";

import { useEffect, useState } from "react";

import NewPost from "@/components/NewPost";
import Points from "@/components/Points";
import Post from "@/components/Post";

export default function Home() {

  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    const req = await fetch("/api/posts");
    const fetchedPosts = await req.json();

    setPosts(fetchedPosts);
  }

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <>
      <div className="header">
        <img className="logo" src="/logo.png" />
        <Points />
      </div>
      <div className="posts">
        <NewPost />
        {posts.map(post => <Post post={post} key={post.id} /> )}      
      </div>
    </>
  )
}
