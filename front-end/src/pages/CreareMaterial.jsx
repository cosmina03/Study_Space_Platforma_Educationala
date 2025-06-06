import React, { useState, useRef } from "react";
import "./CreareMaterial.css";
import { TextField, Button, IconButton, Box } from "@mui/material";
import { AttachFile, DriveFolderUpload, YouTube, Link, AddCircle } from "@mui/icons-material";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { API_URL } from "../constants.js";

export default function CreareMaterial() {

  const location = useLocation()
  const state = location.state
  const material = state?.material
  const { id } = useParams();
  const navigate = useNavigate();
  const [titlu, setTitlu] = useState(material?.titlu || "");
  const [descriere, setDescriere] = useState(material?.descriere|| "");
  const fileInputRef = useRef(null)
  const [file, setFile] = useState(null)

  const handleSubmit = async () => {
            try {
                if(!file && !material ){
                    alert("Alegeti un fisier")
                }
    
                const formData = new FormData()
                if(file){
                  formData.append('atasament', file)
                }
                formData.append('titlu', titlu)
                formData.append('descriere', descriere)
                formData.append('idCurs', id)
                if(material?.id){
                  formData.append('idMaterial', material.id)
                }
    
                const response = await fetch(API_URL+'/material', {
                    method: material ? "PUT" : "POST",
                    headers: {
                        'Authentication': localStorage.getItem('jwt') || ''
                    }, body: formData
                })
                const date = await response.json()
                if(response.ok){
                    alert(`Material ${material ? "modificat" : "adaugat"} cu succes!`)
                    navigate(`/curs/${id}`);
                }
            } catch (error) {
                console.error(error)
            }
  };

  const handleBack = () => {
    navigate(`/curs/${id}`);
  };

  const handleClick = () => {
    fileInputRef.current.click()
  }

  const handleChange = (e) => {
    setFile(e.target.files[0])
  }

  return (
    <div className="creare-material-container">
      <Button
        variant="text"
        onClick={handleBack}
        style={{ alignSelf: "flex-start", marginBottom: "1rem" }}
      >
        ← Înapoi la curs
      </Button>

      <Box className="material-form">
        <h2>Material</h2>

        <TextField
          label="Titlu"
          fullWidth
          variant="outlined"
          value={titlu}
          onChange={(e) => setTitlu(e.target.value)}
        />

        <TextField
          label="Descriere (opțional)"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={descriere}
          onChange={(e) => setDescriere(e.target.value)}
          sx={{ marginTop: "2rem" }}
        />

        <Box className="material-actions">
          <span>Atașează:</span>
          <IconButton onClick={handleClick}><AttachFile /></IconButton>
          <input type="file" accept="*/*" name={'atasament'} hidden={true} ref={fileInputRef} onChange={handleChange}/>
        </Box>

        <div className="material-bottom">
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              backgroundColor: "#ced7e0",
              color: "#2f5972",
              fontWeight: "bold",
              borderRadius: "30px",
              padding: "6px 18px",
              textTransform: "none",
              boxShadow: "none",
              fontSize: "15px",
              "&:hover": {
                backgroundColor: "#bfcad4"
              }
            }}
          >
            {`${material ? "Modifica material" : "Salvează material"}`}
          </Button>
        </div>
      </Box>
    </div>
  );
}
