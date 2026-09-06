import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { connectSocket, getSocket } from "../socket";

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
      }

      // When a role changes, the backend also tells US our own
      // new role if we're the one who got promoted/demoted, so
      // we check for that here and update myRole too
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
    };
  }, [roomId, navigate, myUserId]);

  function sendPlaybackEvent(event: "play" | "pause") {
    const socket = getSocket();
    if (!socket) return;
    socket.send(JSON.stringify({ event, payload: {} }));
  }

  // Toggle between moderator and participant.
  // Only the host can call this — the button that triggers it
  // is only shown to the host anyway, but the backend also
  // checks this itself as a safety net.
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

  const canControlPlayback = myRole === "host" || myRole === "moderator";
  const isHost = myRole === "host";

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-white p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-medium">Room {roomId}</h1>
        <span className="text-sm px-3 py-1 rounded-full bg-green-900 text-green-400">
          {playState === "playing" ? "Playing" : "Paused"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="aspect-video bg-neutral-900 rounded-lg flex items-center justify-center border border-neutral-800">
            <span className="text-neutral-500">Video player goes here</span>
          </div>

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

                {/* Host-only controls, hidden for everyone else
                    and never shown on the host's own row */}
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