"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import NewPost from "@/components/NewPost";
import Post from "@/components/Post";
import useSession from "@/lib/useSession";


export default function Home() {
  const { user } = useSession();

  const [posts, setPosts] = useState([]);
  const [postOpen, setPostOpen] = useState(0);
  const [addingPost, setAddingPost] = useState(false);

  const infiniteLoadingRef = useRef(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadedAll, setLoadedAll] = useState(false);

  /* HAE VIESTIT */
  const getPosts = async (timestamp = 0) => {
    const req = await fetch(`/api/posts?last=${timestamp}`);
    const fetchedPosts = await req.json();

    if (fetchedPosts.length < 10) {
      setLoadedAll(true);
    }

    setPosts(currentPosts => [...currentPosts, ...fetchedPosts]);
    setLoadingMore(false);
  }

  useEffect(() => {
    getPosts();
  }, []);

  /* lisää uusi viesti */
  const addNewPost = post => {
    setPosts(oldPosts => [post, ...oldPosts]);
    setAddingPost(false);
  }

  /* ikuisuuslataus */
  const handleObserver = items => {
    if (items[0].isIntersecting && !loadingMore) {
      setLoadingMore(true);
    }
  }

  useEffect(() => {
    if (loadingMore && posts.length > 0 && !loadedAll) {
      const lastLoadedPostTimestamp = new Date(posts[posts.length - 1].createdAt).getTime();
      getPosts(lastLoadedPostTimestamp);
    }
  }, [loadingMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver);
    if (infiniteLoadingRef.current) { observer.observe(infiniteLoadingRef.current); }
    return () => { if (infiniteLoadingRef.current) observer.unobserve(infiniteLoadingRef.current); }
  }, [infiniteLoadingRef]);

  /* viestin poisto */
  const deletePost = async postId => {
    if(!confirm("Haluatko varmasti poistaa viestin?")) return false;
    const req = await fetch(`/api/posts/${postId}`, {
      method: "DELETE"
    });
    const { success } = await req.json();

    if(success) {
      setPosts([...posts.filter(post => post.id !== postId)]);
      toast("Viesti poistettu.", { theme: "dark", autoClose: 5000, position: "top-center" });
    } else {
      toast("Viestin poistaminen epäonnistui.", { theme: "dark", autoClose: 5000, position: "top-center" });
    }
  }

  return (
    <>
      <div className="posts">
        <div className="posts-top">
          <div className="posts-sorting">Uusimmat Tykätyimmät Kommentoiduimmat</div>
          {user && user.isLoggedIn && <div className="posts-new">
            <button onClick={() => setAddingPost(adding => !adding)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" /></svg>
              Uusi viesti
            </button>
          </div>}
        </div>
        {addingPost && user && user.isLoggedIn && <NewPost addNewPost={addNewPost} />}
        {posts.length === 0 && [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(loadingPost => <div key={loadingPost} className="post" style={{ flexDirection: "column" }}>
          <div className="post-loading" style={{ width: 200, height: 16, marginBottom: 16 }}></div>
          <div className="post-loading" style={{ width: "50%", height: 20, marginBottom: 16 }}></div>
          <div className="post-loading" style={{ width: 100, height: 12 }}></div>
        </div>)}
        {posts.map(post =>
          <Post
            commentsOpen={post.id === postOpen}
            openPost={setPostOpen}
            deletePost={deletePost}
            post={post}
            key={post.id}
          />
        )}
        {!loadedAll && <div className="infinite-loading-bottom" ref={infiniteLoadingRef}>
          {loadingMore &&
            <div className="infinite-loading-icon">
              <div className="loading-icon-holder">
                <div className="loading-icon"></div>
              </div>
            </div>}
        </div>}
      </div>
    </>
  )
}
