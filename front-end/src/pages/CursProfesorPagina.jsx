import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./CursProfesorPagina.css";
import { API_URL, TIPURI_IMAGINE } from "../constants.js";
import { FaCheck, FaFolder, FaTablet } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { useRef } from "react";



import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  LineChart,
  Legend,
  Line,
} from "recharts";


export default function CursProfesorPagina({ user }) {
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
  const [tema, setTema] = useState(null);
  const [submittedTemaIds, setSubmittedTemaIds] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [progres, setProgres] = useState({});

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

  const fetchProgres = async () => {
    try {
      const response = await fetch(API_URL + `/progres/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authentication: localStorage.getItem("jwt") || "",
        },
      });
      const data = await response.json();
      console.log(progres);
      if (response.ok) {
        setProgres(data);
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
    fetchProgres();
  }, []);

  const handleCreateMaterial = () => navigate(`/curs/${id}/creare-material`);
  const handleCreateTema = () => navigate(`/curs/${id}/creare-tema`);

  const handleDownload = (m, temaFile = false) => {
    const link = document.createElement("a");
    link.href = `${API_URL}/${temaFile ? "tema" : "atasament"}/${
      m.cale_atasament
    }/${m.tip_atasament}/true`;
    link.download = `Atasament ${m.titlu}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEditareMaterial = (m) =>
    navigate(`/curs/${id}/creare-material`, { state: { material: m } });
  const handleEditareTema = (m) =>
    navigate(`/curs/${id}/creare-tema`, { state: { material: m } });

  const handleTema = () => fileInputRef.current.click();
  const handleChange = (e) => setTema(e.target.files[0]);

  const trimiteTema = async (idTema) => {
    try {
      const formData = new FormData();
      formData.append("tema", tema);
      const response = await fetch(`${API_URL}/tema/${idTema}`, {
        method: "POST",
        headers: { Authentication: localStorage.getItem("jwt") || "" },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setSubmittedTemaIds((ids) => [...ids, idTema]);
        setTema(null);
        setErrorMessage("");
      } else {
        setErrorMessage(data || "Eroare trimitere temă");
      }
    } catch (error) {
      setErrorMessage(error.message || "Eroare trimitere temă");
    }
  };

  const cancelTema = () => {
    setTema(null);
    setErrorMessage("");
    fileInputRef.current.value = "";
  };

  const handleDownloadFeedback = (idFeedback) => {
    const link = document.createElement("a");
    link.href = `${API_URL}/feedback/${idFeedback}`;
    link.download = "Atasament";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleComplete = async (material) => {
    try {
      const response = await fetch(`${API_URL}/progres/${material.id}`, {
        method: "POST",
        headers: { Authentication: localStorage.getItem("jwt") || "" },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error("");
      }
      setMateriale((prev) => {
        const newMat = [...prev];
        const selectedMat = newMat.find((m) => m.id == material.id);
        if (selectedMat) {
          selectedMat.completat = 1;
        }
        return newMat;
      });
    } catch (error) {
      alert(error.message || "Eroare transmitere progres");
    }
  };

  return (
    <div className="profesor-wrapper">
      <input
        type="file"
        accept="*/*"
        hidden
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
          {user?.elev === false && (
            <span
              className={tab === "studenti" ? "activ" : ""}
              onClick={() => setTab("studenti")}
            >
              Studenți
            </span>
          )}
          {user?.elev === true && (
            <span
              className={tab === "studenti" ? "activ" : ""}
              onClick={() => setTab("parcursulMeu")}
            >
              Parcursul-Meu
            </span>
          )}
        </div>
        {!user.elev && (
          <div className="buton-plus-wrapper">
            <button
              className="buton-plus"
              onClick={() => setShowMenu((p) => !p)}
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
        )}
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
                          <FaFolder style={{ marginRight: 6 }} />
                          Descarcă material
                        </button>

                        {m.completat == 1 ? (
                          <span style={{ backgroundColor: "rgb(46, 170, 40)" }}>
                            <FaCheck style={{ marginRight: 6 }} />
                            Completat
                          </span>
                        ) : (
                          <button
                            className="btn"
                            onClick={() => handleComplete(m)}
                          >
                            <FaCheck style={{ marginRight: 6 }} />
                            Marcheaza completat
                          </button>
                        )}
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
              const hasFeedback = Boolean(m.text);
              const hasSubmitted = submittedTemaIds.includes(m.id);

              return (
                <div className="card-collapsible" key={idx}>
                  <div
                    className="card-header"
                    onClick={() =>
                      setExpandedIndex(isExpanded ? null : `tema-${idx}`)
                    }
                  >
                    <span className="arrow">{isExpanded ? "▼" : "▶"}</span>
                    <span className="card-title">
                      {m.titlu} {m.nota && `Nota: ${m.nota}`}
                    </span>
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

                      {user.elev && m.text && (
                        <div className="feedback-profesor">
                          <strong>Feedback profesor:</strong> {m.text}
                        </div>
                      )}

                      {user.elev && m.cale_atasament && m.id_feedback && (
                        <button
                          className="btn"
                          onClick={() => handleDownloadFeedback(m.id_feedback)}
                        >
                          Descarcă atașament profesor
                        </button>
                      )}

                      <div className="card-actions">
                        {user.elev ? (
                          <>
                            <button
                              className="btn"
                              onClick={() => handleDownload(m, true)}
                            >
                              <FaFolder style={{ marginRight: 6 }} />
                              Descarcă temă
                            </button>

                            {!hasFeedback && (
                              <>
                                {!hasSubmitted ? (
                                  <button className="btn" onClick={handleTema}>
                                    <FaTablet style={{ marginRight: 6 }} />
                                    Trimite tema
                                  </button>
                                ) : (
                                  <div className="alert-success">
                                    Tema a fost trimisă. Curând vei primi
                                    feedback.
                                  </div>
                                )}

                                {tema && (
                                  <>
                                    <div
                                      className="file-name"
                                      title={tema.name}
                                    >
                                      Fișier ales: {tema.name}
                                    </div>
                                    <span className="error">
                                      {errorMessage}
                                    </span>

                                    <button
                                      className="btn btn-cancel"
                                      onClick={cancelTema}
                                    >
                                      <FaTablet style={{ marginRight: 6 }} />
                                      Anulare
                                    </button>
                                    <button
                                      className="btn btn-confirm"
                                      onClick={() => trimiteTema(m.id)}
                                    >
                                      <FaTablet style={{ marginRight: 6 }} />
                                      Confirmare
                                    </button>
                                  </>
                                )}
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            <button
                              className="btn"
                              onClick={() => handleDownload(m, true)}
                            >
                              <FaFolder style={{ marginRight: 6 }} />
                              Descarcă temă
                            </button>
                            <button
                              className="btn-edit"
                              onClick={() => handleEditareTema(m)}
                            >
                              Editare temă
                            </button>
                          </>
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
            {curs.studenti?.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        )}

        {tab === "parcursulMeu" && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
          >
            <div style={{ display: "flex" }}>
              <div>Progres general : </div>
              <div
                style={{
                  width: "100%",
                  backgroundColor: "rgb(177, 177, 177)",
                  padding: "1px",
                  borderRadius: "1rem",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${progres?.procent || 0}%`,
                    backgroundColor: "rgb(63, 169, 255)",
                    padding: "1px",
                    borderRadius: "1rem",
                  }}
                ></div>
                <span
                  style={{
                    position: "relative",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    top: "-75%",
                    color: "white",
                  }}
                >{`${Math.round(progres?.procent || 0)}%`}</span>
              </div>
            </div>
            <div>Media notelor : {progres?.medie || ""}</div>
             <div>
              <div className="chart-wrapper animated-chart">
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart
                    data={progres?.note||{}}
                    // data={dateTabel}

                    margin={{ top: 20, right: 20, left: 40, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="titlu"
                    />
                    <YAxis domain={[1, 10]}/>
                    <Legend/>
                    <Tooltip formatter={(valoare) => [`${valoare}`, "Număr"]} />
                    <Line type="monotone" dataKey="nota" stroke="#8884d8" />

                    
      
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
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
        */ //accept="*/*"
/*
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
            const hasFeedback = Boolean(m.text);
            const hasSubmitted = submittedTemaIds.includes(m.id);

            return (
              <div className="card-collapsible" key={idx}>
                <div
                  className="card-header"
                  onClick={() =>
                    setExpandedIndex(isExpanded ? null : `tema-${idx}`)
                  }
                >
                  <span className="arrow">{isExpanded ? "▼" : "▶"}</span>
                  <span className="card-title">
                    {m.titlu} {m.nota && `Nota: ${m.nota}`}
                  </span>
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

                    {user.elev && m.text && (
                      <div className="feedback-profesor">
                        <strong>Feedback profesor:</strong> {m.text}
                      </div>
                    )}

                    {user.elev && m.cale_atasament && m.id_feedback && (
                      <button
                        className="btn"
                        onClick={() => handleDownloadFeedback(m.id_feedback)}
                      >
                        Descarcă atașament profesor
                      </button>
                    )}

                    <div className="card-actions">
                      {user.elev ? (
                        <>
                          <button
                            className="btn"
                            onClick={() => handleDownload(m, true)}
                          >
                            <FaFolder style={{ marginRight: 6 }} />
                            Descarcă temă
                          </button>

                          {!hasFeedback && (
                            <>
                              {!hasSubmitted ? (
                                <button className="btn" onClick={handleTema}>
                                  <FaTablet style={{ marginRight: 6 }} />
                                  Trimite tema
                                </button>
                              ) : (
                                <div className="alert-success">
                                  ✅ Tema a fost trimisă. Curând vei primi feedback.
                                </div>
                              )}

                              {tema && (
                                <>
                                  <span>Fișier ales: {tema.name}</span>
                                  <span className="error">{errorMessage}</span>
                                  <button
                                    className="btn"
                                    style={{ backgroundColor: "red", color: "white" }}
                                    onClick={cancelTema}
                                  >
                                    <FaTablet style={{ marginRight: 6 }} />
                                    Anulare
                                  </button>
                                  <button
                                    className="btn"
                                    style={{ backgroundColor: "green", color: "white" }}
                                    onClick={() => trimiteTema(m.id)}
                                  >
                                    <FaTablet style={{ marginRight: 6 }} />
                                    Confirmare
                                  </button>
                                </>
                              )}
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          <button
                            className="btn"
                            onClick={() => handleDownload(m, true)}
                          >
                            <FaFolder style={{ marginRight: 6 }} />
                            Descarcă temă
                          </button>
                          <button
                            className="btn-edit"
                            onClick={() => handleEditareTema(m)}
                          >
                            Editare temă
                          </button>
                        </>
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
*/
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
*/
