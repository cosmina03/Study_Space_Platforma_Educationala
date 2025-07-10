import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_URL } from "../constants";
import "./FeedbackCurs.css";

const FeedbackCurs = () => {
  const { id } = useParams();
  const [feedback, setFeedback] = useState([]);
  const [curs, setCurs] = useState(null); 

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch(`${API_URL}/cursuri/toate`, {
          headers: {
            "Content-Type": "application/json",
            Authentication: localStorage.getItem("jwt") || "",
          },
        });

        const data = await response.json();
        if (response.ok) {
          const cursGasit = data.cursuri?.find((c) => c.id == id);
          if (cursGasit) {
            const lista = JSON.parse(cursGasit.lista_feedback || "[]");
            setFeedback(lista.filter((f) => !!f));
            setCurs(cursGasit);
          }
        }
      } catch (err) {
        console.error("Eroare la preluarea feedback-ului", err);
      }
    };

    fetchFeedback();
  }, [id]);

  return (
    <div className="pagina-feedback">
      <h2>
        Toate feedback-urile pentru cursul:{" "}
        <span style={{ color: "#1f4462" }}>{curs?.titlu || `#${id}`}</span>
      </h2>

      <ul>
        {feedback.length > 0 ? (
          feedback.map((f, i) => <li key={i}>{f}</li>)
        ) : (
          <p>Nu există feedback-uri pentru acest curs.</p>
        )}
      </ul>
    </div>
  );
};

export default FeedbackCurs;
