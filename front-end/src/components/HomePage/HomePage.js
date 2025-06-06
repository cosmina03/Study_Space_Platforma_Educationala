
import React, { useEffect, useState } from 'react';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import { API_URL } from "../../constants.js";
import StatisticiChart from '../StatisticiChart/StatisticiChart.jsx';

export default function HomePage({ user }) {
  const [mesaj, setMesaj] = useState("Bun venit în StudySpace");
  const [subtext, setSubtext] = useState("Conectează-te pentru a descoperi o experiență educațională completă.");
  const navigate = useNavigate();

  // Setăm subtext-ul în funcție de tipul de utilizator (elev / profesor)
  useEffect(() => {
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        if (userData.elev) {
          setSubtext("Alege cursul potrivit pentru nevoile tale!");
        } else {
          setSubtext("Creează cursuri, evaluează teme și monetizează cunoștințele tale!");
        }
      } catch (e) {
        console.error("Eroare la parsarea userData:", e);
      }
    }
  }, []);

  // Starea în care vom păstra statisticile (elevi, profesori, cursuri, materiale)
  const [stat, setStat] = useState({});

  // Funcție pentru a aduce datele de pe API
  const fetchStatistici = async () => {
    try {
      const response = await fetch(API_URL + "/statistici", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authentication: localStorage.getItem("jwt") || "",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setStat(data.statistici);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Când componenta se montează, apelăm API-ul pentru statistici
  useEffect(() => {
    fetchStatistici();
  }, []);

  return (
    <div className="home-container">
      <h1>{mesaj}</h1>

      <div className="home-card">
        <h2>Spațiul tău educațional în viitor</h2>
        <p>{subtext}</p>
      </div>

      <button
        className="home-button"
        onClick={() => {
          if (!user?.nume) {
            navigate('/autentificare');
          } else {
            navigate('/cursuri');
          }
        }}
      >
        Descoperă cursurile
      </button>

      {/* --- SECȚIUNEA DE STATISTICI (grafic) --- */}
      <div className="stats-section">
        <h3 className="stats-heading">De ce StudySpace?</h3>
        {/* Aici afișăm componentele Recharts */}
        <StatisticiChart stat={stat} />
      </div>
    </div>
  );
}

// export default function HomePage({ user}) {
//   const [mesaj, setMesaj] = useState("Bun venit în StudySpace");
//   const [subtext, setSubtext] = useState("Conectează-te pentru a descoperi o experiență educațională completă.");
//   const navigate = useNavigate();
//   useEffect(() => {
//     const userDataString = localStorage.getItem("userData");
//     if (userDataString) {
//       try {
//         const userData = JSON.parse(userDataString);
//         if (userData.elev) {
//           setSubtext("Alege cursul potrivit pentru nevoile tale!");
//         } else {
//           setSubtext("Creează cursuri, evaluează teme și monetizează cunoștințele tale!");
//         }
//       } catch (e) {
//         console.error("Eroare la parsarea userData:", e);
//       }
//     }
//   }, []);

//   const [stat, setStat] = useState({})

//     const fetchStatistici = async () => {
//       try {
//         const response = await fetch(API_URL + "/statistici", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authentication: localStorage.getItem("jwt") || "",
//           },
//         });
  
//         const data = await response.json();
  
//         if (response.ok) {
//           setStat(data.statistici);
//         } 
//       } catch (error) {
//         console.error(error);
//       }
//     };
  
//     useEffect(() => {
//       fetchStatistici();
//     }, []);

//   return (
//     <div className="home-container">
//       <h1>{mesaj}</h1>
//       <div className="home-card">
//         <h2>Spațiul tău educațional în viitor</h2>
//         <p>{subtext}</p>
//       </div>
//       <button className="home-button" onClick={() => {
//     if ((!user?.nume)) {
//       navigate('/autentificare');
//     } else {
//       navigate('/cursuri');
//     }}} >Descoperă cursurile</button>

//     <div>
//       <div>De ce StudySpace?</div>

//       <div style={{display: 'flex', 'alignContent': 'space-between', gap:'2rem'}}>
//         <div style={{backgroundColor:"#ffeeff", borderRadius:'1rem', padding:'1rem'}}>
//           {stat.elevi} elevi
//         </div>
//         <div style={{backgroundColor:"#ffeeff", borderRadius:'1rem', padding:'1rem'}}>
//           {stat.profesori} profesori
//         </div>
//         <div style={{backgroundColor:"#ffeeff", borderRadius:'1rem', padding:'1rem'}}>
//           {stat.cursuri} cursuri
//         </div>
//         <div style={{backgroundColor:"#ffeeff", borderRadius:'1rem', padding:'1rem'}}>
//           {stat.materiale} materiale
//         </div>
//       </div>
//     </div>
//     </div>
//   );
// }
