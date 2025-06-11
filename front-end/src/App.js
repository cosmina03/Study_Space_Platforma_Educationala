import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import Header from './components/Header/Header';
import LoginSignUp from './components/Login/LoginSignUp';
import Cursuri from './pages/Cursuri.jsx';
import CreareCurs from './pages/CreareCurs.jsx';
import StudySpaceDrawer from './components/Drawer/Drawer';
import CursProfesorPagina from './pages/CursProfesorPagina';
import CreareMaterial from './pages/CreareMaterial.jsx';
import CreareTema from './pages/CreareTema.jsx';
import Abonamente from './pages/Abonamente.jsx';
import ProcesarePlata from './pages/ProcesarePlata.jsx';
import ProfilElev from './pages/ProfilElev.jsx'
import CursuriPersonaleElev from './pages/CursuriPersoanaleElev.jsx';
import PaginaFinante from './pages/PaginaFinante.jsx';
import TemeProfesor from './pages/TemeProfesor.jsx';
import Feedback from './pages/Feedback.jsx';
import PaginaFavorite from './pages/PaginaFavorite.jsx';
function App() {
  const [user, setUser] = useState({});

  useEffect(() => {
    refreshHeader()
  }, []);

  const refreshHeader  = () => {
    console.log('refresh')
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser({})
        console.error("Eroare parsare user:", e);
      }
    }else{
      setUser({})
    }
    
  } 

  return (
    <Router>
      <div>
         <Header user={user} refreshHeader={refreshHeader}/>
      
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/autentificare" element={<LoginSignUp setUser={setUser} refreshHeader={refreshHeader}/>} />
          <Route path="/cursuri" element={<Cursuri user={user} refreshHeader={refreshHeader}/>} />
          <Route path="/creare-curs" element={<CreareCurs user={user}/>} />
          <Route path="/curs/:id" element={<CursProfesorPagina user={user}/>} />
          <Route path="curs/:id/creare-material" element={<CreareMaterial user={user}/>}/>
          <Route path="curs/:id/creare-tema" element={<CreareTema user={user}/>}/>

          <Route path="/abonamente" element={<Abonamente user={user}/>} />
          <Route path="/plata" element={<ProcesarePlata user={user}/>} />
          <Route path="/profil" element={<ProfilElev/>}/>
          <Route path="/cursuri-personale" element={<CursuriPersonaleElev user={user}/>}/>
          <Route path="/finante" element={<PaginaFinante />} />
          <Route path="/teme" element={<TemeProfesor user={user}/>} />
          <Route path="/feedback" element={<Feedback user={user}/>} />
          <Route path="/favorite" element={<PaginaFavorite user={user} refreshHeader={refreshHeader}/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

/*import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import Header from './components/Header/Header';
import LoginSignUp from './components/Login/LoginSignUp';
import Cursuri from './pages/Cursuri.jsx';
import CreareCurs from './pages/CreareCurs.jsx';



function App() {
  const [user, setUser] = useState(null);

  // Load user from localStorage when app loads
  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Eroare parsare user:", e);
      }
    }
  }, []);

  return (
    <Router>
      <div>
       
        {window.location.pathname !== '/autentificare' && <Header user={user} />}
       
        <Routes>
          
          <Route path="/" element={<HomePage />} />
          <Route path="/autentificare" element={<LoginSignUp setUser={setUser} />} />
          <Route path="/cursuri" element={<Cursuri />} />
          <Route path="/creare-curs" element={<CreareCurs />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
/*
function App() {
  
  return (
    <Router>
      <div>
      {window.location.pathname != '/autentificare' && <Header/>}
      <Routes>
        <Route path={'/'} element = {<HomePage/>}/>
        <Route path="/autentificare" element={<LoginSignUp />} />
        <Route path="/cursuri" element={<Cursuri />} />
        <Route path="/creare-curs" element={<CreareCurs />} />
      </Routes>
    </div>
    </Router>

  )
}

export default App;
*/