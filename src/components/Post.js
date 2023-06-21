export default function Post({ post }) {
  return (
    <>
      <div className="post">
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4l0 0 0 0 0 0 0 0 .3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z" /></svg> 0
          </div>
        </div>
        <div className="post-votes">
          <button>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z" /></svg>
          </button>
          <div className="post-votes-count">0</div>
          <button>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
          </button>
        </div>
      </div>
      {post.id === 4 && <div className="post-comments">
        <div className="post-comment">
          <div className="post-area">
            <div className="post-details">
              <span>@1</span> &nbsp;&bull;&nbsp; 4m
            </div>
            <div className="post-text">kommentti</div>
          </div>
          <div className="post-votes">
            <button>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z" /></svg>
            </button>
            <div className="post-votes-count">0</div>
            <button>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
            </button>
          </div>
        </div>
        <div className="post-comment">
          <div className="post-area">
            <div className="post-details">
              <span>@2</span> &nbsp;&bull;&nbsp; 4m
            </div>
            <div className="post-text">kommentti</div>
          </div>
          <div className="post-votes">
            <button>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z" /></svg>
            </button>
            <div className="post-votes-count">0</div>
            <button>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
            </button>
          </div>
        </div>
      </div>}
    </>
  )
}