import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoomByCode } from "../services/api";
import { socket } from "../socket/socket";
import { useAuth } from "../context/AuthContext";
import RoomChat from "../components/RoomChat";
import Whiteboard from "../components/Whiteboard";
import {
  RiTeamLine,
  RiArrowLeftLine,
  RiFileCopyLine,
  RiLoader4Line,
  RiUserLine,
  RiWifiLine,
  RiLogoutBoxLine,
} from "react-icons/ri";

export default function StudyRoom() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [room, setRoom] = useState(null);
  const [members, setMembers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socketConnected, setSocketConnected] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await getRoomByCode(roomCode);
        setRoom(res.data.room);
        setMembers(res.data.room.members || []);
      } catch (err) {
        setError(err.response?.data?.message || "Room not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomCode]);

  useEffect(() => {
    if (!user || !roomCode) return;

    if (!socket.connected) socket.connect();

    const handleConnect = () => {
      setSocketConnected(true);
      socket.emit("join-room", { roomCode, user });
    };

    const handleDisconnect = () => {
      setSocketConnected(false);
    };

    const handleRoomUsers = (users) => {
      setOnlineUsers(users || []);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("room-users", handleRoomUsers);

    if (socket.connected) handleConnect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("room-users", handleRoomUsers);
    };
  }, [roomCode, user]);

  const copyRoomCode = async () => {
    await navigator.clipboard.writeText(roomCode);
  };

  const handleLeaveRoom = () => {
    socket.emit("leave-room", { roomCode, user });
    navigate("/rooms");
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex items-center gap-2 text-white/60">
          <RiLoader4Line className="animate-spin text-accent-glow text-xl" />
          Loading room...
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="glass-card p-8 text-center">
          <RiTeamLine className="text-5xl text-white/20 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-white mb-2">
            Room not found
          </h1>
          <p className="text-white/40 mb-6">{error}</p>
          <button
            onClick={() => navigate("/rooms")}
            className="btn-primary inline-flex items-center gap-2"
          >
            <RiArrowLeftLine />
            Back to Rooms
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-6 animate-fade-in">
      <div className="glass-card p-5 mb-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-3">
            <button
              onClick={() => navigate("/rooms")}
              className="p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-all mt-1"
            >
              <RiArrowLeftLine />
            </button>

            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <RiTeamLine className="text-accent-glow" />
                {room.title}
              </h1>

              <p className="text-white/40 text-sm mt-1">
                {room.description || "Collaborative realtime study room"}
              </p>

              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <span className="badge bg-accent-purple/10 text-accent-glow border border-accent-purple/20 font-mono">
                  Code: {room.roomCode}
                </span>

                <button
                  onClick={copyRoomCode}
                  className="badge bg-white/5 text-white/60 border border-white/10 hover:text-white hover:border-accent-purple/40 transition-all"
                >
                  <RiFileCopyLine className="text-xs" />
                  Copy
                </button>

                <button
                  onClick={handleLeaveRoom}
                  className="badge bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all"
                >
                  <RiLogoutBoxLine className="text-xs" />
                  Leave Room
                </button>

                <span
                  className={`badge border ${
                    socketConnected
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : "bg-red-500/10 text-red-400 border-red-500/20"
                  }`}
                >
                  <RiWifiLine className="text-xs" />
                  {socketConnected ? "Realtime connected" : "Disconnected"}
                </span>
              </div>
            </div>
          </div>

          <div className="min-w-[220px]">
            <p className="text-white/40 text-xs mb-2">
              Online users ({onlineUsers.length})
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              {onlineUsers.length === 0 ? (
                <span className="text-white/30 text-sm">No users online</span>
              ) : (
                onlineUsers.slice(0, 6).map((u) => (
                  <div
                    key={u.socketId}
                    title={u.email}
                    className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent-purple to-accent-indigo flex items-center justify-center text-[10px] font-bold text-white">
                      {u.name?.charAt(0).toUpperCase() || <RiUserLine />}
                    </div>
                    <span className="text-white/70 text-xs max-w-[80px] truncate">
                      {u.name}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-5">
        <div className="glass-card p-4 min-h-[650px]">
          <Whiteboard roomCode={roomCode} socket={socket} />
        </div>

        <div className="glass-card min-h-[650px] max-h-[650px] overflow-hidden">
          <RoomChat roomCode={roomCode} socket={socket} />
        </div>
      </div>

      <div className="glass-card p-5 mt-5">
        <h2 className="text-white font-semibold mb-3">
          Room Members ({members.length})
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {members.map((member) => (
            <div
              key={member._id || member.email}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-purple to-accent-indigo flex items-center justify-center text-sm font-bold text-white">
                {member.name?.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="text-white/80 text-sm font-medium truncate">
                  {member.name}
                </p>
                <p className="text-white/30 text-xs truncate">{member.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}