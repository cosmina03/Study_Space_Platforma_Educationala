/*import React, { useState, useRef } from "react";
import "./CreareTema.css";
import { TextField, Button, IconButton, Box } from "@mui/material";
import {
  AttachFile,
  DriveFolderUpload,
  YouTube,
  Link,
  AddCircle,
} from "@mui/icons-material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../constants.js";

export default function Feedback() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const tema = location.state.tema;
  const [descriere, setDescriere] = useState("");
  const [deadline, setDeadline] = useState("");
  const [file, setFile] = useState(null);
  const [nota, setNota] = useState(5);
  const fileInputRef = useRef(null);

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("atasament", file);
      formData.append("feedback", descriere);
      formData.append("nota", nota);
      formData.append("id_rasp", tema.id_rasp);

      const response = await fetch(API_URL + "/feedback", {
        method: "POST",
        headers: {
          Authentication: localStorage.getItem("jwt") || "",
        },
        body: formData,
      });
      const date = await response.json();
      if (response.ok) {
        alert(`Feedback adaugat cu succes!`);
        navigate(`/teme`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="creare-tema-container">

      <Box className="tema-form">
        <h2>Feedback temă pentru {tema.nume}</h2>
      
        <TextField
          label="Feedback"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={descriere}
          onChange={(e) => setDescriere(e.target.value)}
          sx={{ marginTop: "1rem" }}
          InputProps={{ style: { fontSize: "16px" } }}
          InputLabelProps={{ style: { fontSize: "16px" } }}
        />

        <input
          label="Nota"
          fullWidth
          sx={{ marginTop: "1rem" }}
          InputLabelProps={{ shrink: true }}
          value={nota}
          type="number"
          min="1"
          max="10"
          onChange={(e) => setNota(e.target.value)}
        />

        <Box className="tema-actions">
          <span>Atașează:</span>
          <IconButton onClick={handleClick}>
            <AttachFile />
          </IconButton>
          <input
            type="file"
            
            name={"atasament"}
            hidden={true}
            ref={fileInputRef}
            onChange={handleChange}
          />
        </Box>

        <div className="tema-bottom">
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              backgroundColor: "#ced7e0",
              color: "#2f5972",
              fontWeight: "bold",
              borderRadius: "30px",
              padding: "10px 28px",
              textTransform: "none",
              boxShadow: "none",
              fontSize: "16px",
              "&:hover": {
                backgroundColor: "#bfcad4",
              },
            }}
          >
            Salvează tema
          </Button>
        </div>
      </Box>
    </div>
  );
}*/
import React, { useState, useRef } from "react";
import {
  TextField,
  Button,
  IconButton,
  Box,
  Typography,
  Paper,
} from "@mui/material";
import { AttachFile } from "@mui/icons-material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../constants.js";

export default function Feedback() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const tema = location.state.tema;

  const [descriere, setDescriere] = useState("");
  const [nota, setNota] = useState(5);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("atasament", file);
      formData.append("feedback", descriere);
      formData.append("nota", nota);
      formData.append("id_rasp", tema.id_rasp);

      const response = await fetch(API_URL + "/feedback", {
        method: "POST",
        headers: {
          Authentication: localStorage.getItem("jwt") || "",
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        alert("Feedback adăugat cu succes!");
        navigate("/teme");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="creare-tema-container">
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 700, margin: "auto", marginTop: 5 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
          Feedback temă pentru {tema.nume}
        </Typography>

        <TextField
          label="Feedback"
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          value={descriere}
          onChange={(e) => setDescriere(e.target.value)}
          sx={{ marginBottom: 3 }}
        />

        <TextField
          label="Notă"
          type="number"
          inputProps={{ min: 1, max: 10 }}
          value={nota}
          onChange={(e) => setNota(e.target.value)}
          fullWidth
          sx={{ marginBottom: 3 }}
        />

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 3 }}>
          <Typography>Atașează:</Typography>
          <IconButton color="primary" onClick={handleClick}>
            <AttachFile />
          </IconButton>
          <input
            type="file"
            hidden
            ref={fileInputRef}
            onChange={handleChange}
          />
          {file && (
            <Typography variant="body2" sx={{ fontStyle: "italic" }}>
              {file.name}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            backgroundColor: "#ced7e0",
            color: "#2f5972",
            fontWeight: "bold",
            borderRadius: "30px",
            padding: "10px 28px",
            textTransform: "none",
            fontSize: "16px",
            "&:hover": {
              backgroundColor: "#bfcad4",
            },
          }}
        >
          Trimite feedback
        </Button>
        </Box>
      </Paper>
    </div>
  );
}
