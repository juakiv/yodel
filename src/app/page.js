"use client";

import { useEffect, useState } from "react";
import { Lobster } from "next/font/google";

import NewPost from "@/components/NewPost";
import Points from "@/components/Points";
import Post from "@/components/Post";
import useSession from "@/lib/useSession";

const lobster = Lobster({ subsets: ["latin"], weight: ["400"] });

export default function Home() {

  const { user } = useSession();

  const [posts, setPosts] = useState([]);
  const [addingPost, setAddingPost] = useState(false);

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
        <div className="logo">
          <img className="logo" src="/logo.png" />
          <span className={lobster.className}>Yodel</span>
        </div>
        <Points />
      </div>
      <div className="posts">
        <div className="posts-top">
          <div className="posts-sorting">Uusimmat Tykätyimmät Kommentoiduimmat</div>
          <div className="posts-new">
            <button onClick={() => setAddingPost(adding => !adding)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" /></svg>
              Uusi viesti
            </button>
          </div>
        </div>
        {addingPost && user && user.isLoggedIn && <NewPost />}
        {posts.map(post => <Post post={post} key={post.id} />)}
      </div>
    </>
  )
}
