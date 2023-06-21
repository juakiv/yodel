"use client";

import { useState } from "react";

export default function NewPost() {
  const colors = ["yellow", "red", "lilac", "aqua", "green"]
  const [selectedColor, setSelectedColor] = useState("yellow");

  const onSubmit = event => {
    event.preventDefault();
    const formData = new FormData(event.target);

    fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData))
    });
  }
  return (
    <form className="new-post" onSubmit={e => onSubmit(e)}>
      <textarea name="content" placeholder="Mitä mielessä?"></textarea>

      <div className="new-post-controls">
        <button type="submit">Yodlaa</button>
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