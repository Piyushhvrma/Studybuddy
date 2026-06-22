import { useEffect, useRef, useState } from "react";
import {
  RiBrushLine,
  RiDeleteBinLine,
  RiEraserLine,
  RiPencilLine,
} from "react-icons/ri";

export default function Whiteboard({ roomCode, socket }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#a78bfa");
  const [lineWidth, setLineWidth] = useState(3);

  const lastPointRef = useRef(null);
  const remoteLastPointRef = useRef(null);

  const getCanvasContext = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    return ctx;
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    const oldImage = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const rect = container.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.putImageData(oldImage, 0, 0);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  };

  useEffect(() => {
    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  const getPoint = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    let clientX;
    let clientY;

    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
      color: tool === "eraser" ? "#ffffff" : color,
      lineWidth: tool === "eraser" ? 18 : lineWidth,
    };
  };

  const drawLine = (from, to) => {
    const ctx = getCanvasContext();
    if (!ctx || !from || !to) return;

    ctx.beginPath();
    ctx.strokeStyle = to.color;
    ctx.lineWidth = to.lineWidth;
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.closePath();
  };

  const handleStart = (e) => {
    e.preventDefault();

    const point = getPoint(e);
    lastPointRef.current = point;
    setIsDrawing(true);

    socket.emit("draw-start", {
      roomCode,
      point,
    });
  };

  const handleMove = (e) => {
    if (!isDrawing) return;

    e.preventDefault();

    const point = getPoint(e);

    drawLine(lastPointRef.current, point);

    socket.emit("draw-move", {
      roomCode,
      point,
    });

    lastPointRef.current = point;
  };

  const handleEnd = () => {
    if (!isDrawing) return;

    setIsDrawing(false);
    lastPointRef.current = null;

    socket.emit("draw-end", {
      roomCode,
    });
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = getCanvasContext();

    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    socket.emit("clear-board", {
      roomCode,
    });
  };

  useEffect(() => {
    const handleRemoteStart = (point) => {
      remoteLastPointRef.current = point;
    };

    const handleRemoteMove = (point) => {
      drawLine(remoteLastPointRef.current, point);
      remoteLastPointRef.current = point;
    };

    const handleRemoteEnd = () => {
      remoteLastPointRef.current = null;
    };

    const handleRemoteClear = () => {
      const canvas = canvasRef.current;
      const ctx = getCanvasContext();

      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    socket.on("draw-start", handleRemoteStart);
    socket.on("draw-move", handleRemoteMove);
    socket.on("draw-end", handleRemoteEnd);
    socket.on("clear-board", handleRemoteClear);

    return () => {
      socket.off("draw-start", handleRemoteStart);
      socket.off("draw-move", handleRemoteMove);
      socket.off("draw-end", handleRemoteEnd);
      socket.off("clear-board", handleRemoteClear);
    };
  }, [socket]);

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <div>
          <h2 className="text-white font-semibold flex items-center gap-2">
            <RiBrushLine className="text-accent-glow" />
            Shared Whiteboard
          </h2>
          <p className="text-white/30 text-xs mt-1">
            Draw diagrams, explain concepts, and brainstorm together.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setTool("pen")}
            className={`px-3 py-2 rounded-lg border text-sm flex items-center gap-1.5 transition-all ${
              tool === "pen"
                ? "bg-accent-purple/20 text-accent-glow border-accent-purple/40"
                : "bg-white/5 text-white/50 border-white/10 hover:text-white"
            }`}
          >
            <RiPencilLine />
            Pen
          </button>

          <button
            onClick={() => setTool("eraser")}
            className={`px-3 py-2 rounded-lg border text-sm flex items-center gap-1.5 transition-all ${
              tool === "eraser"
                ? "bg-accent-purple/20 text-accent-glow border-accent-purple/40"
                : "bg-white/5 text-white/50 border-white/10 hover:text-white"
            }`}
          >
            <RiEraserLine />
            Eraser
          </button>

          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 cursor-pointer"
            title="Choose pen color"
          />

          <select
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="bg-white/5 border border-white/10 text-white/70 rounded-lg px-3 py-2 text-sm outline-none"
          >
            <option value="2" className="bg-dark-800">
              Thin
            </option>
            <option value="3" className="bg-dark-800">
              Normal
            </option>
            <option value="6" className="bg-dark-800">
              Thick
            </option>
            <option value="10" className="bg-dark-800">
              Bold
            </option>
          </select>

          <button
            onClick={handleClear}
            className="px-3 py-2 rounded-lg border text-sm flex items-center gap-1.5 bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20 transition-all"
          >
            <RiDeleteBinLine />
            Clear
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="relative flex-1 min-h-[560px] bg-white rounded-xl overflow-hidden border border-white/10"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />

        <div className="absolute bottom-3 left-3 pointer-events-none">
          <span className="text-xs text-black/40 bg-black/5 rounded-lg px-3 py-1">
            Room Code: {roomCode}
          </span>
        </div>
      </div>
    </div>
  );
}