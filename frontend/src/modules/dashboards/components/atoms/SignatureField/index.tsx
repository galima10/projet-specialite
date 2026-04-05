import { useRef, useState, useEffect } from "react";
import styles from "./SignatureField.module.scss";

export default function SignatureField({
  onChange,
  error,
  value,
}: {
  onChange: (dataUrl: string) => void;
  error: string;
  value: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const signatureDataUrl = value;

  useEffect(() => {
    if (!canvasRef.current || !signatureDataUrl) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = signatureDataUrl;

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  }, [signatureDataUrl]);

  const startDrawing = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    setIsDrawing(true);
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const { x, y } = getEventPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const { x, y } = getEventPos(e);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isCanvasEmpty()) {
      onChange("");
    } else {
      const dataUrl = canvas.toDataURL("image/png");
      onChange(dataUrl);
    }
  };

  const getEventPos = (e: any) => {
    const canvas = canvasRef.current;
    const rect = canvas?.getBoundingClientRect();
    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - (rect?.left || 0),
        y: e.touches[0].clientY - (rect?.top || 0),
      };
    } else {
      return {
        x: e.clientX - (rect?.left || 0),
        y: e.clientY - (rect?.top || 0),
      };
    }
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    onChange(""); // réinitialise la signature
  };

  const isCanvasEmpty = () => {
    const canvas = canvasRef.current;
    if (!canvas) return true;

    const ctx = canvas.getContext("2d");
    if (!ctx) return true;

    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    // si un pixel n'est pas transparent => signature présente
    return !pixels.some((value) => value !== 0);
  };

  return (
    <div className={styles.inputContainer}>
      <label htmlFor="signature">Signature :</label>
      <canvas
        id="signature"
        ref={canvasRef}
        width={400}
        height={150}
        style={{
          border: "1px solid #ccc",
          borderRadius: 4,
          touchAction: "none",
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      <button
        type="button"
        onClick={clearCanvas}
        style={{ marginTop: "0.5rem" }}
      >
        Effacer
      </button>
      {error && (
        <p className="error">
          <small>{error}</small>
        </p>
      )}
    </div>
  );
}
