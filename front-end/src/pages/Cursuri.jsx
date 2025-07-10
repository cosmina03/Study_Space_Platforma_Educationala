import { useEffect, useState } from "react";
import "./Cursuri.css";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../constants.js";
import filledStar from "../assets/filled-star.svg";
import coin from "../assets/coin.svg";
import { useUser } from "../components/UserContext/UserContext.js"; 
const SURSA_POZA = "http://localhost:8080/poza";


const Cursuri = ({ refreshHeader }) => {
  const navigate = useNavigate();
  const [cursuri, setCursuri] = useState([]);
  const [cursuriFiltrate, setCursuriFiltrate] = useState([]);
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [favorited, setFavorited] = useState([]);
  const { user, setUser } = useUser();
const [expandedId, setExpandedId] = useState(null);

const toggleDescriere = (id) => {
  setExpandedId((prev) => (prev === id ? null : id));
};

const fetchCursuri = async () => {
  try {
    const [toateRes, propriiRes] = await Promise.all([
      fetch(API_URL + "/cursuri/toate", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authentication: localStorage.getItem("jwt") || "",
        },
      }),
      fetch(API_URL + "/cursuri/proprii", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authentication: localStorage.getItem("jwt") || "",
        },
      }),
    ]);

    const toateData = await toateRes.json();
    const propriiData = await propriiRes.json();

    if (toateRes.ok && propriiRes.ok) {
      const cumparate = propriiData.cursuri.map((c) => c.id);

      const marcate = toateData.cursuri.map((c) => ({
        ...c,
        dejaCumparat: cumparate.includes(c.id),
      }));

      setCursuri(marcate);
      setCursuriFiltrate(marcate);
    } else {
      setErrorMessage("Eroare la preluarea cursurilor");
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
         const updatedUser = { ...user, credite: user.credite - curs.cost };
        setUser(updatedUser);
        navigate("/cursuri-personale");
        fetchCursuri();
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

  const [afisare, setAfisare] = useState(false)

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
          <div className="card-info">
  <h3>{curs.titlu}</h3>
 <h4>
  {expandedId === curs.id
    ? curs.descriere
    : curs.descriere?.substring(0, 130)}
</h4>

{curs.descriere?.length > 130 && (
  <div
    className="toggle-descriere"
    onClick={() => toggleDescriere(curs.id)}
  >
    {expandedId === curs.id ? "vezi mai puțin" : "..."}
  </div>
)}
  {user?.elev && <p className="author">Creator: {curs.nume}</p>}
  <p className="cost">Cost: {curs.cost} credite</p>

  <div className="rating-placeholder">
    {curs.rating ? (
      <div
        className="course-rating-wrapper"
        onMouseEnter={() => setAfisare(curs.id)}
        onMouseLeave={() => setAfisare(false)}
      >
        <div className="course-rating">
          <img src={filledStar} alt="rating" />
          <span className="clickable-rating">{(+curs.rating).toFixed(1)}</span>
        </div>
        {afisare === curs.id && (
          <div className="feedback-popup-hover">
            <h4>Feedback curs:</h4>
            {(() => {
  const lista = JSON.parse(curs?.lista_feedback || "[]").filter((fb) => !!fb);
  const primele5 = lista.slice(0, 5);
  return (
    <>
      {primele5.map((fb, index) => (
        <p key={index} className="feedback-msg">🗨️ {fb}</p>
      ))}
      {lista.length > 4 && (
        <p
          className="feedback-msg"
          style={{ fontWeight: "bold", cursor: "pointer", color: "#1c3b50" }}
          onClick={() =>
            navigate(`/feedback/${curs.id}`, {
              state: { feedback: lista, titlu: curs.titlu },
            })
          }
        >
          Vezi toate feedback-urile →
        </p>
      )}
    </>
  );
})()}
          </div>
        )}
      </div>
    ) : null}
  </div>

  {user?.elev === true && (
  <div className="course-actions">
    {!curs.dejaCumparat ? (
      <>
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
      </>
    ) : (
      <p style={{ color: "lightgreen", fontWeight: "bold" }}>✔ Ai acest curs</p>
    )}
  </div>
)}

  {user?.elev === false && curs.email_profesor === user.email && (
    <button onClick={() => vizualizareCurs(curs.id, curs.titlu)}>
      Vizualizează
    </button>
  )}
</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cursuri;


