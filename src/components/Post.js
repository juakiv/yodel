"use client";

import { useState } from "react";
import { toast } from "react-toastify";

import PostLikes from "./PostLikes";
import useSession from "@/lib/useSession";

export default function Post({ post, commentsOpen, deletePost, openPost }) {
  const { user } = useSession();

  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [sendingComment, setSendingComment] = useState(false);
  const [commentField, setCommentField] = useState("");

  const loadComments = async () => {
    if (commentsOpen) {
      openPost(0);
    } else {
      openPost(post.id);
    }

    if (post._count.comment > 0 && !commentsOpen) {
      setCommentsLoading(true);
      setComments([]);

      const req = await fetch(`/api/posts/${post.id}/comments`);
      const data = await req.json();

      setComments([...data]);
      setCommentsLoading(false);
      post._count.comment = data.length;
    }
  }

  const submitComment = async event => {
    event.preventDefault();
    setSendingComment(true);

    const result = await fetch(`/api/posts/${post.id}/comments`, {
      method: "POST",
      body: JSON.stringify({ content: commentField })
    });
    const { success, post: addedComment } = await result.json();
    setSendingComment(false);

    if (success) {
      setCommentField("");
      setComments([...comments, addedComment]);
      post._count.comment++;
    } else {
      toast("Viestin lähettäminen epäonnistui.", { theme: "dark", autoClose: 5000, position: "top-center" });
    }
  }

  const deleteComment = async postId => {
    if (!confirm("Haluatko varmasti poistaa kommentin?")) return false;
    const req = await fetch(`/api/posts/${postId}`, {
      method: "DELETE"
    });
    const { success } = await req.json();

    if (success) {
      setComments([...comments.filter(comment => comment.id !== postId)]);
      toast("Kommentti poistettu.", { theme: "dark", autoClose: 5000, position: "top-center" });
    } else {
      toast("Kommentin poistaminen epäonnistui.", { theme: "dark", autoClose: 5000, position: "top-center" });
    }
  }

  return (
    <>
      <div className="post">
        <div className="post-area" onClick={() => loadComments()}>
          <div className="post-details">
            <span>@{post.channel}</span> &nbsp;&bull;&nbsp; {new Intl.DateTimeFormat("fi-FI", {
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
        {post.myPost && <button className="post-delete" onClick={() => deletePost(post.id)}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" /></svg>
          Poista
        </button>}
        <PostLikes postId={post.id} initialVotes={post.votes} myVote={post.myVote} />
      </div>
      {commentsOpen && <div className="post-comments">
        {commentsLoading && <div className="infinite-loading-icon">
          <div className="loading-icon-holder">
            <div className="loading-icon"></div>
          </div>
        </div>}
        {comments.map(comment => <div className={`post-comment${comment.myPost ? " post-comment--spacer" : ""}`} key={comment.id}>
          <div className="post-area">
            <div className="post-details">
              <span>@{comment.commentTag === null ? "???" : comment.commentTag === 0 ? "ap" : comment.commentTag}</span> &nbsp;&bull;&nbsp; {new Intl.DateTimeFormat("fi-FI", {
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric"
              }).format(new Date(comment.createdAt))}
            </div>
            <div className={`post-text post-text--${post.color.toLowerCase()}`}>{comment.content}</div>
          </div>
          {comment.myPost && <button className="post-delete" onClick={() => deleteComment(comment.id)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" /></svg>
            Poista
          </button>}
          <PostLikes postId={comment.id} initialVotes={comment.votes} myVote={comment.myVote} />
        </div>
        )}
        {user && user.isLoggedIn && <form className="post-comment" onSubmit={e => submitComment(e)}>
          <textarea onChange={e => setCommentField(e.target.value)} value={commentField} placeholder="Kirjoita kommenttisi..." style={{ minHeight: 30, marginRight: 12 }}></textarea>
          {sendingComment ?
            <button type="submit" disabled><div className="loading-icon loading-icon--button"></div> Kommentoi</button>
            :
            <button type="submit">Kommentoi</button>
          }
        </form>}
      </div>}
    </>
  )
}