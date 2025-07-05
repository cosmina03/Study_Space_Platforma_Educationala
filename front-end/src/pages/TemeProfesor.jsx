// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { API_URL } from "../constants.js";
// import "./TemeProfesor.css"
//const SURSA_POZA = "http://localhost:8080/poza";

// const TemeProfesor = ({ user }) => {
//   const navigate = useNavigate();
//   const [teme, setTeme] = useState([])
//   const [cursuri, setCursuri] = useState([])
//   const [errorMessage, setErrorMessage] = useState("");

//   const fetchTeme = async () => {
//     try {
//       const response = await fetch(API_URL + "/teme", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authentication: localStorage.getItem("jwt") || "",
//         },
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setTeme(data.teme);
//         setCursuri(prev=>{
//             const cursuriSet = {}
//             data.teme.forEach(tema => {
//                 if(!cursuriSet[tema.id_curs]){
//                     cursuriSet[tema.id_curs] = tema.titlu
//                 }
//             })
//             // console.log(cursuriSet)
//             return cursuriSet
//         })

//       } else {
//         setErrorMessage(data.message || "Eroare in preluarea temelor");
//       }
//     } catch (error) {
//       console.error(error);
//       setErrorMessage("Eroare in preluarea temelor");
//     }
//   };

//   useEffect(() => {
//     fetchTeme();
//   }, []);

//   const descarcaRaspuns = async (idRaspuns) => {
//         const link = document.createElement("a");
//         link.href = `${API_URL}/raspuns/${idRaspuns}`;
//         link.download = `Raspuns tema`;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//   };

//   return (
//     <div className="courses-page">

//       <div className="courses-grid">
//         {!!errorMessage && <div>{errorMessage}</div>}
//          {!Object.keys(cursuri)?.length && <div> Momentan nu exista teme neevaluate</div> }
//         {Object.entries(cursuri)?.map(([id, curs]) => {
            
            
//             return(
//             <div key={id}>
//                 <div>{curs}</div>    
//                 {teme?.filter(tema => tema.id_curs == id)?.map( (tema, idxTema) => {

//                     return (
//                     <div style={{display: 'flex', gap: '0.5rem'}}>
//                         <div>Elev : {tema?.nume}</div>
//                         <button onClick={()=>{descarcaRaspuns(tema.id_rasp)}}>Descarca raspuns</button>
//                         <button onClick={()=>{
//                           navigate('/feedback', {state: {tema}})
//                         }}>Adauga feedback</button>
//                     </div>)
//                 } )}
//             </div>)
//         })}
//       </div>
//     </div>
//   );
// };

import { useEffect, useState } from "react";
import "./TemeProfesor.css";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../constants.js";

const TemeProfesor = ({ user }) => {
  const navigate = useNavigate();
  const [teme, setTeme] = useState([]);
  const [temeMap, setTemeMap] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const fetchTeme = async () => {
    try {
      const response = await fetch(API_URL + "/teme", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authentication: localStorage.getItem("jwt") || "",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setTeme(data.teme);

        // Construim un obiect { [id_curs]: titlu_curs }
        const cursuriMap = {};
        data.teme.forEach((tema) => {
          if (!cursuriMap[tema.id_tema]) {
            cursuriMap[tema.id_tema] = tema.titlu;
          }
        });
        setTemeMap(cursuriMap);
      } else {
        setErrorMessage(data.message || "Eroare la preluarea temelor.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Eroare la preluarea temelor.");
    }
  };

  useEffect(() => {
    fetchTeme();
  }, []);

  const descarcaRaspuns = (idRaspuns) => {
    // Creăm un link invizibil și declanșăm click pentru download
    const link = document.createElement("a");
    link.href = `${API_URL}/raspuns/${idRaspuns}`;
    link.download = `Raspuns_Tema_${idRaspuns}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Grupăm temele după id_curs
  const temeGrupate = {};
  teme.forEach((tema) => {
    if (!temeGrupate[tema.id_tema]) {
      temeGrupate[tema.id_tema] = [];
    }
    temeGrupate[tema.id_tema].push(tema);
  });

  return (
    <div className="teme-profesor-page">
      <h1>Teme pentru evaluare</h1>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {!Object.keys(temeMap).length && !errorMessage && (
        <div className="no-teme">Momentan nu există teme neevaluate.</div>
      )}

      <div className="cursuri-container">
        {Object.entries(temeMap).map(([idTema, titluTema]) => (
          <div className="curs-card" key={idTema}>
            <h2 className="curs-title">{titluTema}</h2>

            <div className="teme-list">
              {temeGrupate[idTema]?.map((tema) => (
                <div className="tema-item" key={tema.id_rasp}>
                  <div className="tema-elev">Elev: <strong>{tema.nume}</strong></div>
                  <div className="tema-actions">
                    <button
                      className="btn-descarca"
                      onClick={() => descarcaRaspuns(tema.id_rasp)}
                    >
                      Descarcă răspuns
                    </button>
                    <button
                      className="btn-feedback"
                      onClick={() => navigate("/feedback", { state: { tema } })}
                    >
                      Adaugă feedback
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemeProfesor;

