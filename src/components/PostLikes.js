import useSession from "@/lib/useSession";
import { useEffect, useState } from "react";

export default function PostLikes({ postId, initialVotes, myVote }) {

  const { user } = useSession(); 

  const [likes, setLikes] = useState(initialVotes);
  const [upVoteStatus, setUpVoteStatus] = useState(myVote === "UP" ? "voted" : "regular"); // regular, loading, voted, disabled
  const [downVoteStatus, setDownVoteStatus] = useState(myVote === "DOWN" ? "voted" : "regular"); // regular, loading, voted, disabled

  const onVoteUpPressed = async () => {
    console.log(user && user.isLoggedIn);
    if (!user || !user.isLoggedIn || upVoteStatus !== "regular") return false;

    setDownVoteStatus("disabled");
    setUpVoteStatus("loading");

    const vote = await fetch("/api/posts/vote", {
      method: "POST",
      body: JSON.stringify({
        post: postId,
        type: "UP"
      })
    });
    const data = await vote.json();

    setDownVoteStatus("regular");
    setUpVoteStatus("voted");
    setLikes(data.votes);
  }

  const onVoteDownPressed = async () => {
    if (!user || !user.isLoggedIn || downVoteStatus !== "regular") return false;

    setUpVoteStatus("disabled");
    setDownVoteStatus("loading");

    const vote = await fetch("/api/posts/vote", {
      method: "POST",
      body: JSON.stringify({
        post: postId,
        type: "DOWN"
      })
    });
    const data = await vote.json();

    setUpVoteStatus("regular");
    setDownVoteStatus("voted");
    setLikes(data.votes);
  }

  return (
    <div className="post-votes">
      <button onClick={() => onVoteUpPressed()} className={`post-votes-status--${upVoteStatus}`}>
        {upVoteStatus === "loading" ?
          <div className="loading-icon"></div>
          :
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z" /></svg>
        }
      </button>
      <div className="post-votes-count">{likes}</div>
      <button onClick={() => onVoteDownPressed()} className={`post-votes-status--${downVoteStatus}`}>
        {downVoteStatus === "loading" ?
          <div className="loading-icon"></div>
          :
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
        }
      </button>
    </div>
  )
}