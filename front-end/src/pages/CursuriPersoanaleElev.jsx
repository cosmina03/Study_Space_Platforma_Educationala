import { useEffect, useState } from "react";
import "./CursuriPersonaleElev.css";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../constants.js";
import emptyStar from '../assets/empty-star.svg'
import filledStar from '../assets/filled-star.svg'

const MAX_STARS = 5

const CursuriPersonaleElev = ({user}) => {
  const navigate = useNavigate();
  const [cursuri, setCursuri] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchCursuri = async () => {
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
        setCursuri(data.cursuri);
      } else {
        setErrorMessage(data.message || "Eroare in preluarea cursurilor");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Eroare in preluarea cursurilor");
    }
  };

  useEffect(() => {
    fetchCursuri();
  }, []);

  const vizualizareCurs = (id, nume) => {
    //TODO remove
    toggleOverlay()
    return
    navigate(`/curs/${id}`, {state: {nume}})
  }

  const sendRating = async (feedbackInclus = false) => {
     try {
      const response = await fetch(API_URL + `/rating/${payload.idCurs}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authentication: localStorage.getItem("jwt") || "",
        },body:JSON.stringify({rating: payload.newRating, feedbackScris : feedbackInclus ? feedbackScris: null})
      });

      toggleOverlay()
      if (response.ok) {
        setCursuri(prev=>{
          const newCursuri = [...prev]
          const curs = newCursuri.find(curs=>curs.id === payload.idCurs)
          curs.rating = payload.newRating
          return newCursuri
        })
      } 
    } catch (error) {
      console.error(error);
    }
  }


  const handleStarClick = async (newRating, idCurs) => {
      setPayload({newRating, idCurs})
      toggleOverlay()
  }

  const [payload, setPayload] = useState({})
  const [overlay, setOverlay] = useState(false)
  const [feedbackScris, setFeedbackScris] = useState('')
  const toggleOverlay = () => {
    setOverlay(prev=>!prev)
  }

  const closeOverlay = (e) => {
    if(e.target == e.currentTarget){
      toggleOverlay()
    }
  }

      return (
        <div className="courses-page">
    
          {overlay && <div className="popup-feedback-overlay" onClick={closeOverlay}>
            <div className="popup-feedback">
              <div>Doresti sa adaugi si un mesaj?</div>
              <input type="text" value={feedbackScris} onChange={(e)=>setFeedbackScris(e.target.value)}/>
              <button onClick={()=>sendRating(true)}>Trimitere</button>
              <br/>
              <button onClick={()=>sendRating(false)}>Trimitere fara</button>
            </div>
            
          </div>}

          <div className="courses-grid">
            {!!errorMessage && <div>{errorMessage}</div>}

            {(!cursuri || !Array.isArray(cursuri) || !cursuri?.length) && <div>Nu ati achizitionat niciun curs inca.</div>}
            {cursuri?.map((curs) => (
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
               {user.elev && curs.rating !== null && <div className="rating">
                  {[...Array(curs.rating).keys()].map(item => 
                      <img src={filledStar} onClick={()=>handleStarClick(item+1, curs.id)}/>
                  )}
                  {[...Array(MAX_STARS - curs.rating).keys()].map(item => 
                      <img src={emptyStar} onClick={()=>handleStarClick(curs.rating+item+1, curs.id)}/>
                  )}
                </div>}
                {user.elev && curs.rating === null && <div className="rating">
                  {[...Array(MAX_STARS).keys()].map(item => 
                      <img src={emptyStar} onClick={()=>handleStarClick(curs.rating+item+1, curs.id)}/>
                  )}
                </div>}

                {user?.elev && (
                  <div className="course-actions">
                    <button className="btn-buy" onClick={()=>vizualizareCurs(curs.id, curs.tilu)}>Vizualizeaza</button>
                  </div>
                )}
                {user?.elev == false && <button onClick={()=>vizualizareCurs(curs.id, curs.titlu)}>Vizualizeaza</button>}
              </div>
            ))}
          </div>
        </div>
      );
}

export default CursuriPersonaleElev