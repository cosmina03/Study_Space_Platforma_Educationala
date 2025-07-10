import React, { useState } from "react";
import "./ProfilElev.css";
import defaultAvatar from "../assets/default-avatar.jpg";
import { API_URL } from "../constants.js";
import { useRef } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProfilElev = ({ user, refreshHeader }) => {
  const [editName, setEditName] = useState(false);
  const [newName, setNewName] = useState(user.nume);

  const updateNume = async (nume) => {
    try {
      const response = await fetch(API_URL + "/schimbare/nume", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authentication: localStorage.getItem("jwt") || "",
        },
        body: JSON.stringify({ nume }),
      });

      const data = await response.json();

      if (response.ok) {
        const userData = { ...user };
        userData.nume = nume;
        localStorage.setItem("userData", JSON.stringify(userData));
        refreshHeader();
      } else {
        alert("Eroare in schimbarea numelui");
      }
    } catch (error) {
      console.error(error);
      alert("Eroare in schimbarea numelui");
    }
  };

  const handleNameChange = () => {
    updateNume(newName);
    setEditName(false);
  };

  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleSubmit = async (file) => {
    try {
      if (!file) {
        alert("Alegeti un fisier");
      }
      // console.log
      const formData = new FormData();
      formData.append("poza_profil", file);

      const response = await fetch(API_URL + "/schimbare/poza", {
        method: "PUT",
        headers: {
          Authentication: localStorage.getItem("jwt") || "",
        },
        body: formData,
      });
      const date = await response.json();
      if (response.ok) {
        const userData = { ...user };
        userData.calePoza = date.uuid;
        localStorage.setItem("userData", JSON.stringify(userData));
        refreshHeader();
      } else {
        alert("Poza nu a putut fi schimbata");
      }
    } catch (error) {
      console.error(error);
      alert("Poza nu a putut fi schimbata");
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    // setFile(e.target.files[0])
    handleSubmit(e.target.files[0]);

  };

  const [cursuri, setCursuri] = useState([]);
  const fetchCursuri = async (nume) => {
    try {
      const response = await fetch(API_URL + "/recente/cursuri", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authentication: localStorage.getItem("jwt") || "",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setCursuri(data?.cursuri);
      } else {
        // alert("Eroare in schimbarea numelui")
      }
    } catch (error) {
      console.error(error);
      // alert("Eroare in schimbarea numelui")
    }
  };

  useEffect(() => {
    fetchCursuri();
  }, []);

  const navigate = useNavigate()
  const navigateToCourse = (id, titlu) => {
    navigate(`/curs/${id}`, { state: { nume:titlu } });
  }

  return (
    <div className="profil-page">
      <div className="left-panel">
        {user?.calePoza ? (
          <img
            src={API_URL + "/poza/profil/" + user.calePoza}
            alt={"Poza profil"}
             className="avatar-profil"
          />
        ) : (
          <img
            src={defaultAvatar}
            alt="Poza profil"
            className="avatar-profil"
          />
        )}

        <input
          type="file"
          accept="*/*"
          name={"poza_profil"}
          hidden={true}
          ref={fileInputRef}
          onChange={handleChange}
        />

        {editName ? (
          <>
            <input
              className="input-nume"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <button className="btn-save" onClick={handleNameChange}>
              Salvează
            </button>
          </>
        ) : (
          <>
            <h2>{user.nume}</h2>
            <p className="email">{user.email}</p>
            <button className="btn-edit-nume" onClick={() => setEditName(true)}>
              Modifică nume
            </button>
          </>
        )}

        <button className="modifica-poza" onClick={handleClick}>
          Modifică poza
        </button>
      </div>

      {user?.elev && <div className="right-panel">
        <div className="info-box">
          <h3>Număr credite:</h3>
          <p className="credit-count">{user.credite}</p>
        </div>

         <div className="cursuri-box">
          <h3>Cursuri achiziționate recent (click pentru a-l accesa)</h3>
          {cursuri?.length ? 
            <div>
            {cursuri.map( (curs, idCurs)=>{
              return <div key={idCurs}>
                <div onClick={() => navigateToCourse(curs.id, curs.titlu)}>
                ➤ {curs?.titlu}
              </div></div>
                          }) }
            </div>
          : <p className="fara-cursuri">Nu ai încă cursuri achiziționate.</p>}
        </div>
      </div>}
    </div>
  );
};

export default ProfilElev;
