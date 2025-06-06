import React, { useState, useRef } from "react";
import "./CreareTema.css";
import { TextField, Button, IconButton, Box } from "@mui/material";
import { AttachFile, DriveFolderUpload, YouTube, Link, AddCircle } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../constants.js";

export default function CreareTema() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [titlu, setTitlu] = useState("");
  const [descriere, setDescriere] = useState("");
  const [deadline, setDeadline] = useState("");
  const [file, setFile] = useState(null)
  const fileInputRef = useRef(null)

  const handleSubmit = async () => {
            try {
                if(!file){
                    alert("Alegeti un fisier")
                }
    
                const formData = new FormData()
                formData.append('atasament', file)
                formData.append('titlu', titlu)
                formData.append('descriere', descriere)
                formData.append('deadline', deadline)
                formData.append('idCurs', id)
    
                const response = await fetch(API_URL+'/tema', {
                    method: "POST",
                    headers: {
                        'Authentication': localStorage.getItem('jwt') || ''
                    }, body: formData
                })
                const date = await response.json()
                if(response.ok){
                    alert(`Tema adaugata cu succes!`)
                    navigate(`/curs/${id}`);
                }
            } catch (error) {
                console.error(error)
            }
  };

  const handleClick = () => {
    fileInputRef.current.click()
  }

  const handleChange = (e) => {
    setFile(e.target.files[0])
  }

  return (
    <div className="creare-tema-container">
      <Button
        variant="text"
        onClick={() => navigate(`/curs/${id}`)}
        style={{ alignSelf: "flex-start", marginBottom: "1rem" }}
      >
        ← Înapoi la curs
      </Button>

      <Box className="tema-form">
        <h2>Temă</h2>

        <TextField
          label="Titlu"
          fullWidth
          variant="outlined"
          value={titlu}
          onChange={(e) => setTitlu(e.target.value)}
          InputProps={{ style: { fontSize: '16px' } }}
          InputLabelProps={{ style: { fontSize: '16px' } }}
        />

        <TextField
          label="Descriere (opțional)"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={descriere}
          onChange={(e) => setDescriere(e.target.value)}
          sx={{ marginTop: "1rem" }}
          InputProps={{ style: { fontSize: '16px' } }}
          InputLabelProps={{ style: { fontSize: '16px' } }}
        />

        <TextField
          label="Deadline"
          type="date"
          fullWidth
          sx={{ marginTop: "1rem" }}
          InputLabelProps={{ shrink: true }}
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />

        <Box className="tema-actions">
          <span>Atașează:</span>
          <IconButton onClick={handleClick}><AttachFile /></IconButton>
          <input type="file" accept="*/*" name={'atasament'} hidden={true} ref={fileInputRef} onChange={handleChange}/>
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
                backgroundColor: "#bfcad4"
              }
            }}
          >
            Salvează tema
          </Button>
        </div>
      </Box>
    </div>
  );
}
