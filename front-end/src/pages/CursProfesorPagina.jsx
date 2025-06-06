import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./CursProfesorPagina.css";
import { API_URL, TIPURI_IMAGINE } from "../constants.js";
import { FaFolder, FaTablet } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { useRef } from "react";

export default function CursProfesorPagina({ user = { user } }) {
  const { id } = useParams();
  const location = useLocation();
  const nume = location?.state?.nume || "";
  const [curs, setCurs] = useState({});
  const [tab, setTab] = useState("materiale");
  const [showMenu, setShowMenu] = useState(false);
  const [teme, setTeme] = useState([]);
  const [materiale, setMateriale] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [tema, setTema] = useState(null);

  const fetchMateriale = async () => {
    try {
      const response = await fetch(API_URL + `/materiale/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authentication: localStorage.getItem("jwt") || "",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setMateriale(data.materiale);
      } else {
        setErrorMessage(data.message || "Eroare in preluarea materialelor");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Eroare in preluarea materialelor");
    }
  };

  const fetchTeme = async () => {
    try {
      const response = await fetch(API_URL + `/teme/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authentication: localStorage.getItem("jwt") || "",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setTeme(data.teme);
      } else {
        setErrorMessage(data.message || "Eroare in preluarea temelor");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Eroare in preluarea temelor");
    }
  };

  useEffect(() => {
    fetchMateriale();
    fetchTeme();
  }, []);

  // useEffect(() => {
  //   const cursExemplu = {
  //     id,
  //     titlu: `Cursul cu ID ${id}`,
  //     materiale: [],
  //     studenti: ["Maria Ionescu", "Andrei Popescu"],
  //   };
  //   setCurs(cursExemplu);
  // }, [id]);

  if (!curs) return <div className="loading-text">Se încarcă...</div>;

  const handleCreateMaterial = () => {
    navigate(`/curs/${id}/creare-material`);
  };

  const handleCreateTema = () => {
    navigate(`/curs/${id}/creare-tema`);
  };

  const handleDownload = (m, tema = false) => {
    const link = document.createElement("a");
    link.href = `${API_URL}/${tema ? "tema" : "atasament"}/${
      m.cale_atasament
    }/${m.tip_atasament}/true`;
    link.download = `Atasament ${m.titlu}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEditareMaterial = (material) => {
    navigate(`/curs/${id}/creare-material`, { state: { material } });
  };
  const handleEditareTema = (material) => {
    navigate(`/curs/${id}/creare-tema`, { state: { material } });
  };

  const handleTema = () => {
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    setTema(e.target.files[0]);
  };

  const trimiteTema = async (idTema) => {
    try {
      const formData = new FormData();
      formData.append("tema", tema);

      const response = await fetch(`${API_URL}/tema/${idTema}`, {
        method: "POST",
        headers: {
          Authentication: localStorage.getItem("jwt") || "",
        },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        alert("Tema trimisa cu succes")
        setTema(null)
        setErrorMessage('')
      } else {
        setErrorMessage(data || "Eroare in trimiterea temei");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Eroare in trimiterea temei");
    }
  };

  const cancelTema = () => {
    setTema(false);
    fileInputRef.current.value = "";
  };

  const handleDownloadFeedback = (idFeedback) => {
        const link = document.createElement("a");
    link.href = `${API_URL}/feedback/${idFeedback}`;
    link.download = `Atasament`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="profesor-wrapper">
      <input
        type="file"
        accept="*/*"
        name={"atasament"}
        hidden={true}
        ref={fileInputRef}
        onChange={handleChange}
      />
      <div className="top-bar-prof">
        <h2 className="titlu-curs">
          <em>{nume}</em>
        </h2>
        <div className="tab-uri">
          <span
            className={tab === "materiale" ? "activ" : ""}
            onClick={() => setTab("materiale")}
          >
            Materiale
          </span>
          <span
            className={tab === "teme" ? "activ" : ""}
            onClick={() => setTab("teme")}
          >
            Teme
          </span>
          {user?.elev == false && (
            <span
              className={tab === "studenti" ? "activ" : ""}
              onClick={() => setTab("studenti")}
            >
              Studenți
            </span>
          )}
        </div>
        <div className="buton-plus-wrapper">
          <button
            className="buton-plus"
            onClick={() => setShowMenu((prev) => !prev)}
          >
            +
          </button>
          {showMenu && (
            <div className="plus-menu">
              <div className="menu-item" onClick={handleCreateMaterial}>
                Creează material
              </div>
              <div className="menu-item" onClick={handleCreateTema}>
                Creează temă
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="continut-tab">
        {tab === "materiale" && (
          <div className="lista-materiale">
            {materiale.map((m, idx) => {
              const isImage = TIPURI_IMAGINE.includes(m.tip_atasament);
              const isExpanded = expandedIndex === `mat-${idx}`;
              return (
                <div className="card-collapsible" key={idx}>
                  <div
                    className="card-header"
                    onClick={() =>
                      setExpandedIndex(isExpanded ? null : `mat-${idx}`)
                    }
                  >
                    <span className="arrow">{isExpanded ? "▼" : "▶"}</span>
                    <span className="card-title">{m.titlu}</span>
                  </div>
                  {isExpanded && (
                    <div className="card-body">
                      {isImage && (
                        <img
                          src={`${API_URL}/atasament/${m.cale_atasament}/${m.tip_atasament}/false`}
                          className="material-img"
                          onClick={() =>
                            setSelectedImage(
                              `${API_URL}/atasament/${m.cale_atasament}/${m.tip_atasament}/false`
                            )
                          }
                          style={{ cursor: "zoom-in" }}
                        />
                      )}
                      {m.descriere && <p>{m.descriere}</p>}
                      <div className="card-actions">
                        <button
                          className="btn"
                          onClick={() => handleDownload(m)}
                        >
                          <FaFolder style={{ marginRight: "6px" }} /> Descarcă
                          material
                        </button>
                        {!user.elev && (
                          <button
                            className="btn-edit"
                            onClick={() => handleEditareMaterial(m)}
                          >
                            Editare material
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {tab === "teme" && (
          <div className="lista-materiale">
            {teme.map((m, idx) => {
              const isImage = TIPURI_IMAGINE.includes(m.tip_atasament);
              const isExpanded = expandedIndex === `tema-${idx}`;
              return (
                <div className="card-collapsible" key={idx}>
                  <div
                    className="card-header"
                    onClick={() =>
                      setExpandedIndex(isExpanded ? null : `tema-${idx}`)
                    }
                  >
                    <span className="arrow">{isExpanded ? "▼" : "▶"}</span>
                    <span className="card-title">{m.titlu} {m.nota ? `Nota : ${m.nota}` : ''}</span>
                  </div>
                  {isExpanded && (
                    <div className="card-body">
                      {m.descriere && <p>{m.descriere}</p>}
                      <div className="termen-box">
                        <strong>Termen limita:</strong> {m.termen}
                      </div>
                      {isImage && (
                        <img
                          src={`${API_URL}/atasament/${m.cale_atasament}/${m.tip_atasament}/false`}
                          className="material-img"
                          onClick={() =>
                            setSelectedImage(
                              `${API_URL}/atasament/${m.cale_atasament}/${m.tip_atasament}/false`
                            )
                          }
                          style={{ cursor: "zoom-in" }}
                        />
                      )}
                      {m?.text &&<div>Feedback profesor : {m.text}</div>}
                       {m?.cale_atasament &&<button onClick={()=>{handleDownloadFeedback(m.id_feedback)}}>Descarca atasament profesor</button>}
                      <div className="card-actions">
                        <button
                          className="btn"
                          onClick={() => handleDownload(m, true)}
                        >
                          <FaFolder style={{ marginRight: "6px" }} />
                          Descarcă temă
                        </button>

                        {!tema && (
                          <button className="btn" onClick={() => handleTema()}>
                            <FaTablet style={{ marginRight: "6px" }} />
                            Trimite tema
                          </button>
                        )}

                        {tema && <span>Fisier ales : {tema?.name}</span>}
                        {tema && <span>{errorMessage}</span>}
                        {tema && (
                          <button
                            className="btn"
                            onClick={() => cancelTema()}
                            style={{ backgroundColor: "red", color: "white" }}
                          >
                            <FaTablet style={{ marginRight: "6px" }} />
                            Anulare
                          </button>
                        )}
                        {tema && (
                          <button
                            className="btn"
                            onClick={() => trimiteTema(m.id)}
                            style={{ backgroundColor: "green", color: "white" }}
                          >
                            <FaTablet style={{ marginRight: "6px" }} />
                            Confirmare
                          </button>
                        )}
                        {!user.elev && (
                          <button
                            className="btn-edit"
                            onClick={() => handleEditareTema(m)}
                          >
                            Editare tema
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {tab === "studenti" && (
          <ul>
            {curs.studenti.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        )}
      </div>
      {selectedImage && (
        <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
          <img
            src={selectedImage}
            alt="Mărire material"
            className="modal-image"
          />
        </div>
      )}
    </div>
  );
}
/*
export default function CursProfesorPagina({ user = { user } }) {
  const { id } = useParams();
  const [curs, setCurs] = useState(null);
  const [tab, setTab] = useState("materiale");
  const [showMenu, setShowMenu] = useState(false);
  const [teme, setTeme] = useState([]);
  const [materiale, setMateriale] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const fetchMateriale = async () => {
    try {
      const response = await fetch(API_URL + `/materiale/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authentication: localStorage.getItem("jwt") || "",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setMateriale(data.materiale);
      } else {
        setErrorMessage(data.message || "Eroare in preluarea materialelor");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Eroare in preluarea materialelor");
    }
  };

  const fetchTeme = async () => {
    try {
      const response = await fetch(API_URL + `/teme/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authentication: localStorage.getItem("jwt") || "",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setTeme(data.teme);
      } else {
        setErrorMessage(data.message || "Eroare in preluarea temelor");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Eroare in preluarea temelor");
    }
  };

  useEffect(() => {
    fetchMateriale();
    fetchTeme();
  }, []);

  useEffect(() => {
    const cursExemplu = {
      id,
      titlu: `Cursul cu ID ${id}`,
      materiale: [],
      studenti: ["Maria Ionescu", "Andrei Popescu"],
    };
    setCurs(cursExemplu);
  }, [id]);

  if (!curs) return <div className="loading-text">Se încarcă...</div>;

  const handleCreateMaterial = () => {
    navigate(`/curs/${id}/creare-material`);
  };

  const handleCreateTema = () => {
    navigate(`/curs/${id}/creare-tema`);
  };

  const handleDownload = (m) => {
    const link = document.createElement('a');
    link.href = `${API_URL}/atasament/${m.cale_atasament}/${m.tip_atasament}/true`;
    link.download = `Atasament ${m.titlu}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEditareMaterial = (material) => {
    navigate(`/curs/${id}/creare-material`, { state: { material } });
  };

  return (
    <div className="profesor-wrapper">
      <div className="top-bar-prof">
        <h2 className="titlu-curs"><em>{curs.titlu}</em></h2>
        <div className="tab-uri">
          <span className={tab === "materiale" ? "activ" : ""} onClick={() => setTab("materiale")}>Materiale</span>
          <span className={tab === "teme" ? "activ" : ""} onClick={() => setTab("teme")}>Teme</span>
          <span className={tab === "studenti" ? "activ" : ""} onClick={() => setTab("studenti")}>Studenți</span>
        </div>
        <div className="buton-plus-wrapper">
          <button className="buton-plus" onClick={() => setShowMenu(prev => !prev)}>+</button>
          {showMenu && (
            <div className="plus-menu">
              <div className="menu-item" onClick={handleCreateMaterial}>Creează material</div>
              <div className="menu-item" onClick={handleCreateTema}>Creează temă</div>
            </div>
          )}
        </div>
      </div>

      <div className="continut-tab">
        {tab === "materiale" && (
  <div className="lista-materiale">
    {materiale.map((m, idx) => {
      const isImage = TIPURI_IMAGINE.includes(m.tip_atasament);
      return (
        <div className="card-material" key={idx}>
          {!user.elev && <button className="btn-edit" onClick={() => handleEditareMaterial(m)}>Editare material</button>}
          <h3>{m.titlu}</h3>
          <p>{m.descriere}</p>
          {isImage && <img src={`${API_URL}/atasament/${m.cale_atasament}/${m.tip_atasament}/false`} className="material-img" />}
          <button className="btn" onClick={() => handleDownload(m)}>
            <FaFolder style={{ marginRight: "6px" }} />Descarcă material
          </button>
        </div>
      );
    })}
  </div>
)}

{tab === "teme" && (
  <div className="lista-materiale">
    {teme.map((m, idx) => {
      const isImage = TIPURI_IMAGINE.includes(m.tip_atasament);
      return (
        <div className="card-material" key={idx}>
          <h3>{m.titlu}</h3>
          <p>{m.descriere}</p>
          <p>Termen: {m.termen}</p>
          {isImage && <img src={`${API_URL}/atasament/${m.cale_atasament}/${m.tip_atasament}/false`} className="material-img" />}
          <button className="btn" onClick={() => handleDownload(m)}>
            <FaFolder style={{ marginRight: "6px" }} />Descarcă temă
          </button>
        </div>
      );
    })}
  </div>
)}
        {tab === "studenti" && (
          <ul>
            {curs.studenti.map((s, idx) => <li key={idx}>{s}</li>)}
          </ul>
        )}
      </div>
    </div>
  );
}
/*
export default function CursProfesorPagina({user={user}}) {
  const { id } = useParams();
  const [curs, setCurs] = useState(null);
  const [tab, setTab] = useState("materiale");
  const [showMenu, setShowMenu] = useState(false);
  const [teme, setTeme] = useState([])
  const elev = user.elev
   const navigate = useNavigate();


    const [materiale, setMateriale] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
  
    const fetchMateriale = async () => {
      try {
        const response = await fetch(API_URL + `/materiale/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authentication: localStorage.getItem("jwt") || "",
          },
        });
  
        const data = await response.json();
  
        if (response.ok) {
          setMateriale(data.materiale);
        } else {
          setErrorMessage(data.message || "Eroare in preluarea materialelor");
        }
      } catch (error) {
        console.error(error);
        setErrorMessage("Eroare in preluarea materialelor");
      }
    };

    const fetchTeme = async () => {
      try {
        const response = await fetch(API_URL + `/teme/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authentication: localStorage.getItem("jwt") || "",
          },
        });
  
        const data = await response.json();
  
        if (response.ok) {
          setTeme(data.teme);
        } else {
          setErrorMessage(data.message || "Eroare in preluarea temelor");
        }
      } catch (error) {
        console.error(error);
        setErrorMessage("Eroare in preluarea temelor");
      }
    };
  
    useEffect(() => {
      fetchMateriale();
      fetchTeme()
    }, []);

  useEffect(() => {
    const cursExemplu = {
      id,
      titlu: `Cursul cu ID ${id}`,
      materiale: ["Material 1 - PDF", "Material 2 - Video"],
      studenti: ["Maria Ionescu", "Andrei Popescu"],
    };
    setCurs(cursExemplu);
  }, [id]);

  if (!curs) return <div className="loading-text">Se încarcă...</div>;

  const handleCreateMaterial = () => {
   navigate(`/curs/${id}/creare-material`);
  };

  const handleCreateTema = () => {
    navigate(`/curs/${id}/creare-tema`)
  };

  const handleDownload = (m) => {
    const link = document.createElement('a')
    link.href = `${API_URL}/atasament/${m.cale_atasament}/${m.tip_atasament}/true`
    link.download = `Atasament ${m.titlu}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleEditareMaterial = (material) => {
    navigate(`/curs/${id}/creare-material`, {state: {material}})
  }

  return (
    <div className="profesor-wrapper">
      <div className="top-bar-prof">
        <h2 className="titlu-curs"><em>{curs.titlu}</em></h2>

        <div className="tab-uri">
          <span className={tab === "materiale" ? "activ" : ""} onClick={() => setTab("materiale")}>Materiale</span>
          <span className={tab === "studenti" ? "activ" : ""} onClick={() => setTab("studenti")}>Studenți</span>
        </div>

        <div className="buton-plus-wrapper">
          <button className="buton-plus" onClick={() => setShowMenu(prev => !prev)}>+</button>
          {showMenu && (
            <div className="plus-menu">
              <div className="menu-item" onClick={handleCreateMaterial}>Creează material</div>
              <div className="menu-item" onClick={handleCreateTema}>Creează temă</div>
            </div>
          )}
        </div>
      </div>

      <div className="continut-tab">
        {tab === "materiale" && (
          <>
          <ul>
            {materiale?.map((m, idx) => {
              
              const isImage = TIPURI_IMAGINE.includes(m.tip_atasament)
              return (<li key={idx}>

                {!user.elev && <button onClick={()=>handleEditareMaterial(m)}>Editare material</button>}
              <div>{m.titlu}</div>
              <div>{m.descriere}</div>
             
              {isImage && <img src={`${API_URL}/atasament/${m.cale_atasament}/${m.tip_atasament}/false`} style={{width: '300px'}}/>}
              <button onClick={()=>handleDownload(m)}>Descarcare atasament</button>
            </li>)
            })}
          </ul>
          <div>Teme</div>
          <ul>
            {teme?.map((m, idx) => {
              
              const isImage = TIPURI_IMAGINE.includes(m.tip_atasament)
              return (<li key={idx}>

              <div>{m.titlu}</div>
              <div>{m.descriere}</div>
              <div>Termen : {m.termen}</div>
              
              {isImage && <img src={`${API_URL}/atasament/${m.cale_atasament}/${m.tip_atasament}/false`} style={{width: '300px'}}/>}
              <button onClick={()=>handleDownload(m)}>Descarcare atasament</button>
            </li>)
            })}
          </ul>
          </>
        )}
        {tab === "studenti" && (
          <ul>
            {curs.studenti.map((s, idx) => <li key={idx}>{s}</li>)}
          </ul>
        )}
      </div>
    </div>
  );
}
*/
