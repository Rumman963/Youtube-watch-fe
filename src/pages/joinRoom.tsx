import { useEffect, useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { connectSocket, getSocket } from "../socket";

export function JoinRoom() {
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/signin");
      return;
    }

    const socket = connectSocket(token);

    // Fires once the connection is actually open
    socket.onopen = () => {
      setConnected(true);
    };

    // Fires whenever the server sends us a message
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.event === "room_joined") {
      const roomId = data.payload.roomId;
      navigate(`/room/${roomId}`, {

      state: {
      userId: data.payload.userId,
      role: data.payload.role,
      participants: data.payload.participants,
      
    },
  });
}
      if (data.event === "room_joined") {
  const roomId = data.payload.roomId;
  navigate(`/room/${roomId}`, {
    state: {
      userId: data.payload.userId,
      role: data.payload.role,
      participants: data.payload.participants,
    },
  });
}
      if (data.event === "room_joined") {
  const roomId = data.payload.roomId;
  navigate(`/room/${roomId}`, {
    state: {
      userId: data.payload.userId,
      role: data.payload.role,
      participants: data.payload.participants,
    },
  });
}
      if (data.event === "room_joined") {
  const roomId = data.payload.roomId;
  navigate(`/room/${roomId}`, {
    state: {
      userId: data.payload.userId,
      role: data.payload.role,
      participants: data.payload.participants,
    },
  });
}

      if (data.event === "error") {
        setError(data.payload.message);
      }
    };

    socket.onerror = () => {
      setError("Could not connect. Please try again.");
    };

    // Note: we do NOT close the socket here on cleanup,
    // because we want it to stay open when we navigate
    // to the room dashboard page next.
  }, [navigate]);

  // Sends a join_room event. If a code is passed, we're
  // joining an existing room as a participant. If not,
  // the backend creates a brand new room and makes us host.
  function sendJoinRoom(e: SyntheticEvent, code?: string) {
    e.preventDefault();
    setError("");

    const socket = getSocket();
    if (!socket) return;

    socket.send(
      JSON.stringify({
        event: "join_room",
        payload: code ? { roomId: code } : {},
      })
    );
  }

  return (
    <div className="h-screen w-full bg-neutral-950 text-white flex flex-col items-center justify-center px-6">
      <h1 className="text-2xl font-bold mb-6">Join a watch party</h1>

      {!connected && <p className="text-neutral-400 mb-4">Connecting...</p>}

      <button
        onClick={(e) => sendJoinRoom(e)}
        disabled={!connected}
        className="w-full max-w-sm py-3 mb-4 rounded-lg bg-red-600 hover:bg-red-500 font-medium disabled:opacity-50"
      >
        Create a new room
      </button>

      <p className="text-neutral-400 mb-4">or</p>

      <form onSubmit={(e) => sendJoinRoom(e, roomCode)} className="w-full max-w-sm">
        <input
          type="text"
          placeholder="Enter room code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          className="w-full px-4 py-3 mb-3 rounded-lg bg-neutral-900 border border-neutral-700 outline-none"
        />
        <button
          type="submit"
          disabled={!connected || !roomCode}
          className="w-full py-3 rounded-lg border border-neutral-700 hover:border-neutral-500 font-medium disabled:opacity-50"
        >
          Join room
        </button>
      </form>

      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
    </div>
  );
}