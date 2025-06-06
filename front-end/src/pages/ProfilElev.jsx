import React, { useState } from 'react';
import './ProfilElev.css';
import defaultAvatar from '../assets/default-avatar.jpg';

const ProfilElev = () => {
  const [user, setUser] = useState({
    nume: "Ion Popescu",
    email: "ion.popescu@student.studyspace.ro",
    credite: 9,
  });

  const [editName, setEditName] = useState(false);
  const [newName, setNewName] = useState(user.nume);

  const handleNameChange = () => {
    setUser({ ...user, nume: newName });
    setEditName(false);
  };

  return (
    <div className="profil-page">
      <div className="left-panel">
        <img src={defaultAvatar} alt="Poza profil" className="avatar-profil" />
        
        {editName ? (
          <>
            <input
              className="input-nume"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <button className="btn-save" onClick={handleNameChange}>Salvează</button>
          </>
        ) : (
          <>
            <h2>{user.nume}</h2>
             <p className="email">{user.email}</p>
            <button className="btn-edit-nume" onClick={() => setEditName(true)}>Modifică nume</button>
          </>
        )}
       
        <button className="modifica-poza">Modifică poza</button>
      </div>

      <div className="right-panel">
        <div className="info-box">
          <h3>Număr credite:</h3>
          <p className="credit-count">{user.credite}</p>
        </div>

        <div className="cursuri-box">
          <h3>Cursuri achiziționate recent</h3>
          <p className="fara-cursuri">Nu ai încă cursuri achiziționate.</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilElev;
