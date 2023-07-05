"use client";

import { useState } from "react";
import { toast } from "react-toastify";

export default function NewPost({ addNewPost, channel }) {
  const colors = ["yellow", "red", "lilac", "aqua", "green"];

  const [selectedColor, setSelectedColor] = useState("yellow");
  const [sendingPost, setSendingPost] = useState(false);

  const onSubmit = async event => {
    event.preventDefault();
    const formData = new FormData(event.target);

    setSendingPost(true);

    const result = await fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify({ channel, ...Object.fromEntries(formData) })
    });
    const { success, post } = await result.json();

    if (success) {
      addNewPost(post);
    } else {
      setSendingPost(false);
      toast("Viestin lähettäminen epäonnistui.", { theme: "dark", autoClose: 5000, position: "top-center" });
    }

  }
  return (
    <form className="new-post" onSubmit={e => onSubmit(e)}>
      <textarea name="content" placeholder="Mitä mielessä?"></textarea>

      <div className="new-post-controls">
        {sendingPost ?
          <button type="submit" disabled><div className="loading-icon loading-icon--button"></div> Yodlaa</button>
          :
          <button type="submit">Yodlaa</button>
        }
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