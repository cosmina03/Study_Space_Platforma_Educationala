import { useEffect, useState } from "react"
import { API_URL } from "../constants.js";
import { useNavigate } from "react-router-dom";
import "./PaginaFavorite.css";

const PaginaFavorite = ({user, refreshHeader}) => {
    
    const navigate = useNavigate()
    const [favorite, setFavorite] = useState([])
const [achizitionate, setAchizitionate] = useState([]);

const fetchAchizitionate = async () => {
  try {
    const response = await fetch(API_URL + "/cursuri/proprii", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authentication: localStorage.getItem("jwt") || "",
      },
    });

    const data = await response.json();
    if (response.ok) {
      const ids = data.cursuri.map((c) => c.id);
      setAchizitionate(ids); 
    }
  } catch (error) {
    console.error("Eroare la fetchAchizitionate", error);
  }
};

    const fetchFavorite = async () => {
        try {
            const response = await fetch(API_URL+'/favorite', {
                method: "GET",
                headers: {
                    'Authentication': localStorage.getItem('jwt') || ''
                }
            })
            if(!response.ok){
                throw new Error("");
            }
            const date = await response.json()
            setFavorite(date)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(()=>{
        fetchFavorite();
        fetchAchizitionate();
    }, [])

      const handleBuy = async (curs) => {
        try {
      const response = await fetch(API_URL + `/achizitionare/${curs.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authentication: localStorage.getItem("jwt") || "",
        },
      });

      const data = await response.json();
      if (response.ok) {
        refreshHeader()
        alert(data)
        const newData = {...user}
        newData.credite = newData.credite - curs.cost
        localStorage.setItem('userData', JSON.stringify(newData))
        navigate('/cursuri-personale')
      } else {
        alert(data || "Eroare in achizitonarea cursului");
      }
    } catch (error) {
      console.error(error);
      alert("Eroare in achizitonarea cursului");
    }
  }

    const removeToFavorites = async (id) => {
    try {
      const response = await fetch(API_URL + `/favorite/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authentication: localStorage.getItem("jwt") || "",
        },
      });

      if (response.ok) {
        setFavorite(prev=>{
          const newCursuri = [...prev]
          const cursuriFiltrate = newCursuri.filter(c=>c.id != id)
          return cursuriFiltrate
        });
      } 
    } catch (error) {
      console.error(error);
    }
  }

    return (
        <div className="courses-grid">
                          {(!favorite || favorite.length === 0) && (
                  <div className="fallback-card-wrapper">
                    <div className="fallback-card">
                      <h2>Nu aveți cursuri favorite</h2>
                      <p>Descoperiți cursurile noastre și adăugați-le la favorite!</p>
                      <button onClick={() => navigate("/cursuri")} className="btn-fallback">
                        Vezi cursurile disponibile
                      </button>
                    </div>
                  </div>
                )}
                {favorite?.map((curs) => (
                  <div className="course-card" key={curs.id}>
                    <img
                      src={API_URL + "/poza/" + curs.cale_poza}
                      alt={curs.titlu}
                      className="course-image"
                    />
                    <h3>{curs.titlu}</h3>
                    {user?.elev == true && (
                      <p className="author">Creator: {curs.nume}</p>
                    )}
                    <p className="cost">Cost: {curs.cost} credite</p>
                    <div className="rating">
                      {"★".repeat(curs.rating)}
                      {"☆".repeat(5 - curs.rating)}
                    </div>
                   
                      <div className="course-actions">
                       {achizitionate.includes(curs.id) ? (
                        <button
                          className="btn-view"
                          onClick={() => navigate(`/curs/${curs.id}`, { state: { nume: curs.titlu } })}
                        >
                          Vizualizează
                        </button>
                      ) : (
                        <button className="btn-buy" onClick={() => handleBuy(curs)}>
                          Achiziționează
                        </button>
                      )}
                        <button
                          className="btn-favorite"
                          onClick={() => removeToFavorites(curs.id)}
                          title="Adaugă la favorite"
                        >
                           ❤️
                        </button>
                      </div>      
                  </div>
                ))}
              </div>
    )
}

export default PaginaFavorite