import React from "react";
import "../Alerta/Alerta.css";

export default function Alerta({ mesaj, tip = "success", onClose }) {
  return (
    <div className={`alerta alerta-${tip}`}>
      <span>{mesaj}</span>
      {onClose && <button className="inchide" onClick={onClose}>✕</button>}
    </div>
  );
}