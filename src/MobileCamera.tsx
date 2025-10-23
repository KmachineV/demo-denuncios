import React, { useRef, useState } from "react";
import { Button, Box, Typography } from "@mui/material";


export default function MobileCamera() {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [photoTaken, setPhotoTaken] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get("session");

  const handleOpenCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(s);
      videoRef.current.srcObject = s;
      videoRef.current.play();
    } catch (err) {
      alert("Error al acceder a la cámara");
    }
  };

  const handleTakePhoto = () => {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL("image/jpeg");
    localStorage.setItem(`photo-${sessionId}`, dataUrl);
    setPhotoTaken(true);

    // Apagar cámara
    stream.getTracks().forEach((t) => t.stop());
    setStream(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        p: 3,
      }}
    >
      <Typography variant="h6">Tomar Foto</Typography>

      {!stream && !photoTaken && (
        <Button variant="contained" onClick={handleOpenCamera}>
          Abrir cámara
        </Button>
      )}

      {stream && (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ width: "100%", borderRadius: 8 }}
          />
          <Button variant="contained" onClick={handleTakePhoto}>
            Capturar
          </Button>
        </>
      )}

      {photoTaken && (
        <Typography color="green">
          📸 Foto enviada correctamente. Ya puedes volver al PC.
        </Typography>
      )}
    </Box>
  );
}
