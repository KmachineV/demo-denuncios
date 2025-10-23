import React, { useState, useRef } from "react";
import { Box, Button, MenuItem, Select, TextField, Typography } from "@mui/material";
import QRCode from "react-qr-code";
import { useEffect } from "react";



export default function AccidentForm() {
  const queryParams = new URLSearchParams(window.location.search);
const sessionFromUrl = queryParams.get("session");
  const [reason, setReason] = useState("");
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [qrValue, setQrValue] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setPhotoPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

 const handleOpenCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) videoRef.current.srcObject = stream;
    videoRef.current.play();
  } catch (err) {
    alert(`No se pudo acceder a la cámara 😢, ${err}`);
  }
};

  const handleCapturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const context = canvasRef.current.getContext("2d");
    if (!context) return;
    context.drawImage(videoRef.current, 0, 0, 320, 240);
    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "captura.jpg", { type: "image/jpeg" });
        setFile(file);
        setPhotoPreview(URL.createObjectURL(blob));
      }
    });
    setIsTakingPhoto(false);
    const stream = videoRef.current.srcObject as MediaStream;
    stream.getTracks().forEach((track) => track.stop());
  };

  const handleGenerateQr = () => {
    const uniqueId = Math.random().toString(36).substring(2);
    const url = 'http://192.168.1.2:5173';
    setQrValue(`${url}/?session=${uniqueId}`);

  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ reason, name, file });
    alert("Formulario enviado 🚀");
  };

useEffect(() => {
  if (sessionFromUrl) {
    setIsTakingPhoto(true); // <--- activa la UI de cámara
    handleOpenCamera();
  }
}, [sessionFromUrl]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: 400,
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "#fff",
      }}
    >
      <Typography variant="h6">Reporte de Incidente</Typography>

      <Select value={reason} onChange={(e) => setReason(e.target.value)} displayEmpty>
        <MenuItem value="">Seleccione un motivo</MenuItem>
        <MenuItem value="choque">1. Choque frontal</MenuItem>
        <MenuItem value="falla">2. Falla mecánica</MenuItem>
        <MenuItem value="otro">3. Otro</MenuItem>
      </Select>

      <TextField label="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />

      {reason === "choque" && (
        <>
          <Button variant="outlined" onClick={handleOpenCamera}>
            Tomar Foto
          </Button>
          <Button variant="outlined" component="label">
            Subir desde PC
            <input type="file" accept="image/*" hidden onChange={handleFileChange} />
          </Button>

          <Button variant="outlined" onClick={handleGenerateQr}>
            Generar QR para tomar foto desde el celular
          </Button>

          {qrValue && (
            <Box textAlign="center" mt={2}>
              <Typography variant="body2">Escanea este código con tu celular:</Typography>
              <QRCode value={qrValue} size={180} />
            </Box>
          )}

          {isTakingPhoto && (
            <Box mt={2}>
              <video ref={videoRef} autoPlay width="100%" />
              <Button onClick={handleCapturePhoto} variant="contained" fullWidth>
                Capturar
              </Button>
              <canvas ref={canvasRef} width="320" height="240" hidden />
            </Box>
          )}

          {photoPreview && (
            <Box mt={2}>
              <Typography variant="body2">Vista previa:</Typography>
              <img src={photoPreview} alt="captura" width="100%" />
            </Box>
          )}
        </>
      )}

      <Button type="submit" variant="contained" disabled={!reason || !name}>
        Enviar
      </Button>
    </Box>
  );
}
