"use client";

export default function NewPost() {
  const onSubmit = event => {
    event.preventDefault();
    const formData = new FormData(event.target);

    fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData))
    });
  }
  return (
    <form onSubmit={e => onSubmit(e)}>
      <textarea name="content"></textarea>
      <button type="submit">Yodlaa</button>
    </form>
  )
}