import { useEffect, useState } from "react";
import "./Cursuri.css";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../constants.js";
import filledStar from "../assets/filled-star.svg";
import coin from "../assets/coin.svg";
const SURSA_POZA = "http://localhost:8080/poza";

const Cursuri = ({ user, refreshHeader }) => {
  const navigate = useNavigate();
  const [cursuri, setCursuri] = useState([]);
  const [cursuriFiltrate, setCursuriFiltrate] = useState([]);
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [favorited, setFavorited] = useState([]);

  const fetchCursuri = async () => {
    try {
      const response = await fetch(API_URL + "/cursuri/toate", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authentication: localStorage.getItem("jwt") || "",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setCursuri(data.cursuri);
        setCursuriFiltrate(data.cursuri);
      } else {
        setErrorMessage(data.message || "Eroare in preluarea cursurilor");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Eroare in preluarea cursurilor");
    }
  };

  useEffect(() => {
    refreshHeader();
    fetchCursuri();
  }, []);

  const vizualizareCurs = (id, nume) => {
    navigate(`/curs/${id}`, { state: { nume } });
  };

  const addToFavorites = async (id) => {
    try {
      const response = await fetch(API_URL + `/favorite/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authentication: localStorage.getItem("jwt") || "",
        },
      });

      if (response.ok) {
        setCursuri((prev) => {
          const newCursuri = [...prev];
          const curs = newCursuri.find((c) => c.id == id);
          if (curs) {
            curs.favorit = 1;
          }
          return newCursuri;
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

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
        setCursuri((prev) => {
          const newCursuri = [...prev];
          const curs = newCursuri.find((c) => c.id == id);
          if (curs) {
            curs.favorit = false;
          }
          return newCursuri;
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleFavorite = (id) => {
    const curs = cursuri.find((c) => c.id == id);
    if (curs?.favorit) {
      removeToFavorites(id);
    } else {
      addToFavorites(id);
    }
  };

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
        refreshHeader();
        alert(data);
        const newData = { ...user };
        newData.credite = newData.credite - curs.cost;
        localStorage.setItem("userData", JSON.stringify(newData));
        navigate("/cursuri-personale");
      } else {
        alert(data || "Eroare in achizitonarea cursului");
      }
    } catch (error) {
      console.error(error);
      alert("Eroare in achizitonarea cursului");
    }
  };

  useEffect(() => {
    setCursuriFiltrate(() => {
      const parti = search.toLowerCase().split(" ");
      return cursuri.filter((curs) =>
        parti.every((parte) =>
          `${curs.titlu} ${curs.descriere} ${curs.nume}`
            .toLowerCase()
            .replace(/ă/g, "a")
            .replace(/â/g, "a")
            .replace(/î/g, "i")
            .replace(/ț/g, "t")
            .replace(/ș/g, "s")
            .includes(parte)
        )
      );
    });
  }, [search]);

  return (
    <div className="courses-page">
      {user?.elev == true && (
        <>
          <h1 className="courses-title">Explorează cursurile</h1>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </>
      )}

      <div className="courses-grid">
        {!!errorMessage && <div>{errorMessage}</div>}
        {cursuriFiltrate?.map((curs) => (
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
        {curs.rating && (
          <div className="course-rating">
            <img src={filledStar} alt="rating" />
            <span>{(+curs.rating).toFixed(1)}</span>
          </div>
        )}
        

            {user?.elev && (
              <div className="course-actions">
                <button className="btn-buy" onClick={() => handleBuy(curs)}>
                  Achiziționează
                </button>
                <button
                  className="btn-favorite"
                  onClick={() => toggleFavorite(curs.id)}
                  title="Adaugă la favorite"
                >
                  {curs.favorit ? "❤️" : "♡"}
                </button>
              </div>
            )}
            {user?.elev == false && (
              <button onClick={() => vizualizareCurs(curs.id, curs.titlu)}>
                Vizualizeaza
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cursuri;


