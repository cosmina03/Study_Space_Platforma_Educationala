import { useEffect, useState } from "react"
import { API_URL } from "../constants.js";
import { useNavigate } from "react-router-dom";

const PaginaFavorite = ({user, refreshHeader}) => {
    
    const navigate = useNavigate()
    const [favorite, setFavorite] = useState([])
    const favorited =[]
    const toggleFavorite = ()=>{}

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
        fetchFavorite()
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

    return (
        <div className="courses-grid">
               
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
                        <button className="btn-buy" onClick={()=>handleBuy(curs)}>Achiziționează</button>
                        <button
                          className="btn-favorite"
                          onClick={() => toggleFavorite(curs.id)}
                          title="Adaugă la favorite"
                        >
                          {favorited.includes(curs.id) ? "❤️" : "♡"}
                        </button>
                      </div>
              
                    
                  </div>
                ))}
              </div>
    )
}

export default PaginaFavorite