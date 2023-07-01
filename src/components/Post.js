"use client";

import { useState } from "react";

import PostLikes from "./PostLikes";
import useSession from "@/lib/useSession";

export default function Post({ post }) {
  const { user } = useSession();

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);

  const loadComments = async () => {
    setCommentsOpen(!commentsOpen);
    if (post._count.comment > 0 && !commentsOpen) {
      setCommentsLoading(true);
      setComments([]);

      const req = await fetch(`/api/posts/${post.id}/comments`);
      const data = await req.json();

      setComments([...data]);
      setCommentsLoading(false);
    }
  }

  return (
    <>
      <div className="post" onClick={() => loadComments()}>
        <div className="post-area">
          <div className="post-details">
            <span>@main</span> &nbsp;&bull;&nbsp; {new Intl.DateTimeFormat("fi-FI", {
              month: "numeric",
              day: "numeric",
              hour: "numeric",
              minute: "numeric"
            }).format(new Date(post.createdAt))}
          </div>
          <div className={`post-text post-text--${post.color.toLowerCase()}`}>
            {post.content}
          </div>
          <div className="post-bottom">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4l0 0 0 0 0 0 0 0 .3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z" /></svg>
            {post._count.comment}
          </div>
        </div>
        <PostLikes postId={post.id} initialVotes={post.votes} myVote={post.myVote} />
      </div>
      {commentsOpen && <div className="post-comments">
        {commentsLoading && <div className="infinite-loading-icon">
          <div className="loading-icon-holder">
            <div className="loading-icon"></div>
          </div>
        </div>}
        {comments.map(comment => <div className="post-comment">
          <div className="post-area">
            <div className="post-details">
              <span>@1</span> &nbsp;&bull;&nbsp; {new Intl.DateTimeFormat("fi-FI", {
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric"
              }).format(new Date(comment.createdAt))}
            </div>
            <div className={`post-text post-text--${post.color.toLowerCase()}`}>{comment.content}</div>
          </div>
          <PostLikes postId={comment.id} initialVotes={comment.votes} myVote={comment.myVote} />
        </div>
        )}
        {user && user.isLoggedIn && <div className="post-comment">
          <textarea placeholder="Kirjoita kommenttisi..." style={{ minHeight: 30, marginRight: 12 }}></textarea>
          <button>Kommentoi</button>
        </div>}
      </div>}
    </>
  )
}