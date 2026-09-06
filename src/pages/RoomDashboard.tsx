import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { connectSocket, getSocket } from "../socket";
import { extractYouTubeId } from "../utils/youtube";

interface Participant {
  userId: string;
  username: string;
  role: "host" | "moderator" | "participant";
}

export function RoomDashboard() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const initialData = location.state as
    | { userId: string; role: "host" | "moderator" | "participant"; participants: Participant[] }
    | null;

  const [participants, setParticipants] = useState<Participant[]>(
    initialData?.participants ?? []
  );
  const [myUserId, setMyUserId] = useState(initialData?.userId ?? "");
  const [myRole, setMyRole] = useState<"host" | "moderator" | "participant">(
    initialData?.role ?? "participant"
  );
  const [playState, setPlayState] = useState<"playing" | "paused">("paused");
  const [videoUrlInput, setVideoUrlInput] = useState("");

  const playerRef = useRef<any>(null);
  const currentVideoIdRef = useRef<string>("");
  const playerReadyRef = useRef(false);
  const pendingSyncRef = useRef<any>(null);

  // Loads the YouTube IFrame API script once, then creates the player
  useEffect(() => {
    // Prevent creating a second player if this effect runs twice
    // (React Strict Mode does this in development)
    if (playerRef.current) return;

    function applySync(payload: any) {
      const player = playerRef.current;
      if (!player) return;

      if (payload.videoId && payload.videoId !== currentVideoIdRef.current) {
        currentVideoIdRef.current = payload.videoId;
        player.loadVideoById(payload.videoId);
      }

      if (typeof payload.currentTime === "number") {
        player.seekTo(payload.currentTime, true);
      }

      if (payload.playState === "playing") {
        player.playVideo();
      } else {
        player.pauseVideo();
      }
    }

    function createPlayer() {
      playerRef.current = new (window as any).YT.Player("youtube-player", {
        height: "100%",
        width: "100%",
        videoId: "",
        events: {
          onReady: () => {
            console.log("YouTube player ready");
            playerReadyRef.current = true;

            if (pendingSyncRef.current) {
              applySync(pendingSyncRef.current);
              pendingSyncRef.current = null;
            }
          },
        },
      });
    }

    if ((window as any).YT && (window as any).YT.Player) {
      createPlayer();
    } else {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      (window as any).onYouTubeIframeAPIReady = createPlayer;
    }
  }, []);

  useEffect(() => {
    let socket = getSocket();

    if (!socket) {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin");
        return;
      }
      socket = connectSocket(token);

      socket.onopen = () => {
        socket!.send(
          JSON.stringify({
            event: "join_room",
            payload: { roomId },
          })
        );
      };
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("received:", data);

      if (data.event === "room_joined") {
        setMyUserId(data.payload.userId);
        setMyRole(data.payload.role);
        setParticipants(data.payload.participants);
      }

      if (data.event === "user_joined" || data.event === "user_left") {
        setParticipants(data.payload.participants);
      }

      if (data.event === "sync_state") {
        setPlayState(data.payload.playState);

        if (!playerReadyRef.current) {
          // Player isn't ready yet — remember this and apply it
          // once onReady fires
          pendingSyncRef.current = data.payload;
          return;
        }

        const player = playerRef.current;
        if (!player) return;

        if (data.payload.videoId && data.payload.videoId !== currentVideoIdRef.current) {
          currentVideoIdRef.current = data.payload.videoId;
          player.loadVideoById(data.payload.videoId);
        }

        if (typeof data.payload.currentTime === "number") {
          player.seekTo(data.payload.currentTime, true);
        }

        if (data.payload.playState === "playing") {
          player.playVideo();
        } else {
          player.pauseVideo();
        }
      }

      if (data.event === "role_assigned") {
        setParticipants(data.payload.participants);
        if (data.payload.userId === myUserId) {
          setMyRole(data.payload.role);
        }
      }

      if (data.event === "participant_removed") {
        setParticipants(data.payload.participants);
      }

      if (data.event === "removed_from_room") {
        alert(data.payload.message);
        navigate("/join");
      }
      if (data.event === "error") {
        alert(data.payload.message);
        navigate("/join");
      }

    };
      
  }, [roomId, navigate, myUserId]);

  function sendPlaybackEvent(event: "play" | "pause") {
    const socket = getSocket();
    if (!socket) return;
    socket.send(JSON.stringify({ event, payload: {} }));
  }

function sendChangeVideo() {
  const videoId = extractYouTubeId(videoUrlInput);

  if (!videoId) {
    alert("Couldn't find a video ID in that link. Paste a normal YouTube URL.");
    return;
  }

  const socket = getSocket();
  if (!socket) return;

  socket.send(
    JSON.stringify({
      event: "change_video",
      payload: { videoId },
    })
  );

  // Auto-play once the video loads, so it doesn't look
  // like nothing happened
  socket.send(
    JSON.stringify({
      event: "play",
      payload: {},
    })
  );

  setVideoUrlInput("");
}

  function sendAssignRole(userId: string, currentRole: "host" | "moderator" | "participant") {
    const socket = getSocket();
    if (!socket) return;

    const newRole = currentRole === "moderator" ? "participant" : "moderator";

    socket.send(
      JSON.stringify({
        event: "assign_role",
        payload: { userId, role: newRole },
      })
    );
  }

  function sendRemoveParticipant(userId: string) {
    const socket = getSocket();
    if (!socket) return;

    socket.send(
      JSON.stringify({
        event: "remove_participant",
        payload: { userId },
      })
    );
  }

  function handleLeaveRoom() {
  const socket = getSocket();
  if (socket) {
    socket.send(JSON.stringify({ event: "leave_room", payload: {} }));
  }
  navigate("/join");
}

  const canControlPlayback = myRole === "host" || myRole === "moderator";
  const isHost = myRole === "host";

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-white p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-medium">Room {roomId}</h1>
        <span className="text-sm px-3 py-1 rounded-full bg-green-900 text-green-400">
          {playState === "playing" ? "Playing" : "Paused"}
        </span>
        <button
      onClick={handleLeaveRoom}
      className="text-sm px-3 py-1 rounded-lg border border-neutral-700 hover:border-neutral-500">
      Leave room
      </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="aspect-video bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800">
            <div id="youtube-player" className="w-full h-full" />
          </div>

          {isHost && (
            <div className="flex gap-2 mt-4">
              <input
                type="text"
                placeholder="Paste a YouTube link"
                value={videoUrlInput}
                onChange={(e) => setVideoUrlInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 outline-none text-sm"
              />
              <button
                onClick={sendChangeVideo}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 font-medium text-sm"
              >
                Load
              </button>
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => sendPlaybackEvent("play")}
              disabled={!canControlPlayback}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 font-medium disabled:opacity-40"
            >
              Play
            </button>
            <button
              onClick={() => sendPlaybackEvent("pause")}
              disabled={!canControlPlayback}
              className="px-4 py-2 rounded-lg border border-neutral-700 hover:border-neutral-500 font-medium disabled:opacity-40"
            >
              Pause
            </button>
          </div>

          {!canControlPlayback && (
            <p className="text-neutral-500 text-sm mt-2">
              Only the host or a moderator can control playback
            </p>
          )}
        </div>

        <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-4">
          <h2 className="text-sm text-neutral-400 mb-3">
            Participants ({participants.length})
          </h2>
          <div className="flex flex-col gap-2">
            {participants.map((p) => (
              <div
                key={p.userId}
                className="flex flex-col gap-2 px-3 py-2 rounded-lg bg-neutral-950"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">
                    {p.username}
                    {p.userId === myUserId && (
                      <span className="text-neutral-500"> (you)</span>
                    )}
                  </span>
                  <span
                    className={
                      "text-xs px-2 py-1 rounded-full " +
                      (p.role === "host"
                        ? "bg-amber-900 text-amber-400"
                        : p.role === "moderator"
                        ? "bg-blue-900 text-blue-400"
                        : "bg-neutral-800 text-neutral-400")
                    }
                  >
                    {p.role}
                  </span>
                </div>

                {isHost && p.userId !== myUserId && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => sendAssignRole(p.userId, p.role)}
                      className="text-xs px-2 py-1 rounded-md border border-neutral-700 hover:border-neutral-500"
                    >
                      {p.role === "moderator" ? "Demote" : "Make moderator"}
                    </button>
                    <button
                      onClick={() => sendRemoveParticipant(p.userId)}
                      className="text-xs px-2 py-1 rounded-md border border-red-900 text-red-500 hover:border-red-500"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}