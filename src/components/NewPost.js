"use client";

export default function NewPost() {
  const onSubmit = event => {
    event.preventDefault();
    const formData = new FormData(event.target);

    
  }
  return (
    <form onSubmit={e => onSubmit(e)}>
      <textarea name="content"></textarea>
      <button type="submit">Yodlaa</button>
    </form>
  )
}