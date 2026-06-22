import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom, joinRoom } from "../services/api";
import {
  RiTeamLine,
  RiAddLine,
  RiLoginCircleLine,
  RiLoader4Line,
  RiDoorOpenLine,
  RiFileCopyLine,
  RiChat3Line,
  RiBrushLine,
  RiRobot2Line,
} from "react-icons/ri";

export default function Rooms() {
  const navigate = useNavigate();

  const [createForm, setCreateForm] = useState({
    title: "",
    description: "",
  });

  const [joinCode, setJoinCode] = useState("");
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingJoin, setLoadingJoin] = useState(false);
  const [error, setError] = useState("");
  const [createdRoom, setCreatedRoom] = useState(null);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setError("");
    setCreatedRoom(null);
    setLoadingCreate(true);

    try {
      const res = await createRoom(createForm);
      const room = res.data.room;

      setCreatedRoom(room);

      setTimeout(() => {
        navigate(`/room/${room.roomCode}`);
      }, 600);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create room.");
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    setError("");

    const code = joinCode.trim().toUpperCase();

    if (!code) {
      setError("Please enter a room code.");
      return;
    }

    setLoadingJoin(true);

    try {
      const res = await joinRoom({ roomCode: code });
      navigate(`/room/${res.data.room.roomCode}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to join room.");
    } finally {
      setLoadingJoin(false);
    }
  };

  const copyRoomCode = async () => {
    if (!createdRoom?.roomCode) return;
    await navigator.clipboard.writeText(createdRoom.roomCode);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="page-title flex items-center gap-2">
          <RiTeamLine className="text-accent-glow" />
          Collaborative Study Rooms
        </h1>
        <p className="page-subtitle">
          Create a private room, invite friends, chat in realtime, and draw on a
          shared whiteboard.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {createdRoom && (
        <div className="mb-6 glass-card p-5 border-accent-purple/40">
          <p className="text-white/50 text-sm mb-2">
            Room created successfully
          </p>

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-white font-semibold text-lg">
                {createdRoom.title}
              </h2>
              <p className="text-accent-glow font-mono text-xl mt-1">
                {createdRoom.roomCode}
              </p>
            </div>

            <button
              onClick={copyRoomCode}
              className="btn-secondary flex items-center gap-2"
            >
              <RiFileCopyLine />
              Copy Code
            </button>
          </div>
        </div>
      )}

      <div className="glass-card p-6 md:p-8 mb-6 relative overflow-hidden border-accent-purple/30">
        <div className="absolute top-0 right-0 w-72 h-72 bg-accent-purple/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-52 h-52 bg-accent-indigo/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative grid md:grid-cols-[1.3fr_1fr] gap-6 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-glow text-xs font-semibold mb-4">
              <RiTeamLine />
              Realtime Collaborative Learning
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Study together like a virtual classroom
            </h2>

            <p className="text-white/50 leading-relaxed mb-6">
              Make a room, share the code, discuss doubts through live chat, ask
              AI inside the room, and explain concepts visually on a shared
              whiteboard.
            </p>

            <div className="flex flex-wrap gap-3">
              <span className="badge bg-white/5 text-white/60 border border-white/10">
                <RiChat3Line className="text-accent-glow" />
                Realtime Chat
              </span>
              <span className="badge bg-white/5 text-white/60 border border-white/10">
                <RiBrushLine className="text-accent-glow" />
                Whiteboard
              </span>
              <span className="badge bg-white/5 text-white/60 border border-white/10">
                <RiRobot2Line className="text-accent-glow" />
                Room AI
              </span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-glow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>

            <div className="h-32 rounded-xl bg-white mb-4 relative overflow-hidden">
              <div className="absolute left-6 top-8 w-28 h-1 bg-accent-purple rotate-12 rounded-full" />
              <div className="absolute left-20 top-16 w-36 h-1 bg-accent-indigo -rotate-6 rounded-full" />
              <div className="absolute right-10 top-10 w-16 h-16 border-4 border-accent-purple rounded-full" />
              <p className="absolute bottom-3 left-4 text-black/40 text-xs font-mono">
                Shared Whiteboard
              </p>
            </div>

            <div className="space-y-2">
              <div className="bg-accent-purple/20 rounded-lg p-2 text-sm text-white/80">
                You: Explain binary search?
              </div>
              <div className="bg-white/5 rounded-lg p-2 text-sm text-white/60">
                Friend: Draw it on board 👆
              </div>
              <div className="bg-accent-indigo/20 rounded-lg p-2 text-sm text-white/70">
                AI: Binary search divides the range into halves.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <div className="w-12 h-12 rounded-xl bg-accent-purple/20 flex items-center justify-center mb-4">
            <RiAddLine className="text-accent-glow text-2xl" />
          </div>

          <h2 className="text-xl font-semibold text-white mb-1">
            Create New Room
          </h2>
          <p className="text-white/40 text-sm mb-6">
            Start a private study room and share the room code with friends.
          </p>

          <form onSubmit={handleCreateRoom} className="space-y-4">
            <div>
              <label className="label">Room Title</label>
              <input
                type="text"
                value={createForm.title}
                onChange={(e) =>
                  setCreateForm({ ...createForm, title: e.target.value })
                }
                placeholder="e.g. DSA Discussion Room"
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Description</label>
              <textarea
                value={createForm.description}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    description: e.target.value,
                  })
                }
                placeholder="What will this room be used for?"
                className="textarea-field"
                rows={4}
              />
            </div>

            <button
              type="submit"
              disabled={loadingCreate}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loadingCreate ? (
                <>
                  <RiLoader4Line className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <RiDoorOpenLine />
                  Create Room
                </>
              )}
            </button>
          </form>
        </div>

        <div className="glass-card p-6">
          <div className="w-12 h-12 rounded-xl bg-accent-indigo/20 flex items-center justify-center mb-4">
            <RiLoginCircleLine className="text-accent-glow text-2xl" />
          </div>

          <h2 className="text-xl font-semibold text-white mb-1">
            Join Existing Room
          </h2>
          <p className="text-white/40 text-sm mb-6">
            Enter a room code shared by your friend or study partner.
          </p>

          <form onSubmit={handleJoinRoom} className="space-y-4">
            <div>
              <label className="label">Room Code</label>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="e.g. AB12CD"
                className="input-field font-mono uppercase tracking-widest"
                maxLength={8}
              />
            </div>

            <button
              type="submit"
              disabled={loadingJoin}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              {loadingJoin ? (
                <>
                  <RiLoader4Line className="animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  <RiLoginCircleLine />
                  Join Room
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-white/60 text-sm font-medium mb-2">
              What happens inside a room?
            </p>
            <ul className="text-white/40 text-sm space-y-2">
              <li>• Realtime group chat</li>
              <li>• Shared drawing whiteboard</li>
              <li>• AI assistant inside room</li>
              <li>• Multiple students can discuss together</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}