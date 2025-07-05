import React, { useState } from "react";
import "./CreareMaterial.css";
import { TextField, Button, Box, Typography, Rating } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../constants.js";

export default function FormularFeedback() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [descriere, setDescriere] = useState("");
  const [rating, setRating] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const handleBack = () => navigate(`/curs/${id}`);

  

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
        <h2>Lasă un feedback cursului</h2>

        <TextField
          label="Feedback"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={descriere}
          onChange={(e) => setDescriere(e.target.value)}
          sx={{ marginTop: "2rem" }}
        />

        {errorMessage && (
          <Typography color="error" sx={{ mt: 1 }}>
            {errorMessage}
          </Typography>
        )}

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
              marginTop: "2rem",
              "&:hover": {
                backgroundColor: "#bfcad4"
              }
            }}
          >
            Trimite feedback
          </Button>
        </div>
      </Box>
    </div>
  );
}
