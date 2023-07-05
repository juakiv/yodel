"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import useSession from "@/lib/useSession";
import { toast } from "react-toastify";

export default function ChannelMenu() {

  const { user } = useSession();
  const params = useParams();

  const [channelMenuOpen, setChannelMenuOpen] = useState(false);

  const [channels, setChannels] = useState([]);
  const [channelsLoading, setChannelsLoading] = useState(true);

  const [currentChannelName, setCurrentChannelName] = useState(params.channel || "main");

  const [newChannelName, setNewChannelName] = useState("");
  const [creatingNewChannel, setCreatingNewChannel] = useState(false);

  const selectChannel = name => {
    setCurrentChannelName(name);
    setChannelMenuOpen(false);
  }

  const openChannelMenu = async () => {
    setChannelMenuOpen(!channelMenuOpen);
    if (!channelMenuOpen) {
      setChannelsLoading(true);
      const requestChannels = await fetch("/api/channels");
      const data = await requestChannels.json();
      setChannelsLoading(false);
      setChannels([...data]);
    }
  }

  const createNewChannel = async event => {
    event.preventDefault();
    setCreatingNewChannel(true);

    const req = await fetch("/api/channels", {
      method: "POST",
      body: JSON.stringify({ name: newChannelName })
    });
    const { success, channel } = await req.json();

    if (success) {
      setChannels([...channels, {...channel, _count: { posts: 0 }}]);
      setCreatingNewChannel(false);
      setNewChannelName("");
    } else {
      setCreatingNewChannel(false);
      toast("Kanavan luominen epäonnistui.", { theme: "dark", autoClose: 5000, position: "top-center" });
    }
  }

  return (
    <div className="channel-menu" onClick={() => openChannelMenu()}>
      <span>@{currentChannelName}</span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clipRule="evenodd"></path></svg>
      {channelMenuOpen && <div className="channel-menu-list" onClick={e => e.stopPropagation()}>
        {channelsLoading && <div className="channel-menu-item"><div className="loading-icon"></div></div>}
        {channels.map(channel =>
          <Link key={channel.name} href={channel.name === "main" ? "/" : `/channel/${channel.name}`} className="channel-menu-item" onClick={() => selectChannel(channel.name)}>@{channel.name}<span> - {channel._count.posts} viesti{channel._count.posts === 1 ? "" : "ä"}</span></Link>
        )}
        {user && user.isLoggedIn && <div className="channel-menu-create-channel">
          @
          <input type="text" placeholder="uusi" value={newChannelName} onChange={e => setNewChannelName(e.target.value)} />
          {creatingNewChannel ?
            <button disabled><div className="loading-icon"></div></button>
            :
            <button onClick={e => createNewChannel(e)}>Luo</button>
          }
        </div>}
      </div>}
    </div>
  )
}