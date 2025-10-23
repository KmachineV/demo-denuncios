import { Box } from "@mui/material";
import AccidentForm from "./AccidentForm"; // importa tu formulario

export default function App() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center", // centra horizontal
        alignItems: "center",     // centra vertical
        minHeight: "100vh",       // ocupa todo el alto de la pantalla
        backgroundColor: "#f5f5f5" // opcional, solo para que se vea bonito
      }}
    >
      <AccidentForm />
    </Box>
  );
}