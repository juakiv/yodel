"use client";

import { useState } from "react";
import { toast } from "react-toastify";

export default function NewPost({ addNewPost, channel }) {
  const colors = ["yellow", "red", "lilac", "aqua", "green"];

  const [selectedColor, setSelectedColor] = useState("yellow");
  const [sendingPost, setSendingPost] = useState(false);
  const [content, setContent] = useState("");

  const onSubmit = async event => {
    event.preventDefault();
    const formData = new FormData(event.target);

    setSendingPost(true);

    const result = await fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify({ channel, content, ...Object.fromEntries(formData) })
    });
    const { success, message, post } = await result.json();

    if (success) {
      addNewPost(post);
    } else {
      setSendingPost(false);
      toast(message, { theme: "dark", autoClose: 5000, position: "top-center" });
    }
  }

  return (
    <form className="new-post" onSubmit={e => onSubmit(e)}>
      <textarea maxLength="240" name="content" placeholder="Mitä mielessä?" onChange={e => setContent(e.target.value)} value={content}></textarea>

      <div className="new-post-controls">
        <div className="new-post-button">
          {sendingPost ?
            <button type="submit" disabled><div className="loading-icon loading-icon--button"></div> Yodlaa</button>
            :
            <button type="submit">Yodlaa</button>
          }
          <div className={`post-max-length-indicator${content.length > 200 ? content.length === 240 ? " post-text--red" : " post-text--yellow" : ""}`}>
            <div className="post-max-length-circle" style={{ "--progress": `${Math.ceil((content.length * 100) / 240)}%` }}></div>
            {content.length} merkki{content.length !== 1 && "ä"}
          </div>
        </div>
        <div className="color-selector">
          {colors.map(color =>
            <label key={color}>
              <input type="radio" name="color" onChange={() => setSelectedColor(color)} checked={color === selectedColor} value={color} />
              <div className={`color-selector-option post-text--${color}`}></div>
            </label>
          )}
        </div>
      </div>
    </form>
  )
}