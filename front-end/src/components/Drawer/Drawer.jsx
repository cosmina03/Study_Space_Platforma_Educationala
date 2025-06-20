
import './Drawer.css';
import React, { useEffect, useState } from 'react';
import {
 Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Avatar,
  Box
} from '@mui/material';

import {
  School,
  Assignment,
  MonetizationOn,
  Settings,
  Home,
  Menu
} from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';

export default function StudySpaceDrawer({refreshHeader}) {
  const [state, setState] = useState({ left: false });
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      try {
        setUser(JSON.parse(userDataString));
      } catch (error) {
        console.error("Eroare la parsarea userData:", error);
      }
    }
  }, []);

  const isLoggedIn = !!user;
  if (!isLoggedIn) return null;

  const toggleDrawer = (anchor, open) => (event) => {
    if (event?.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
    setState({ ...state, [anchor]: open });
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    navigate('/autentificare');
    refreshHeader()
  };

  const list = (anchor) => (
    <List className="drawer-list">
      {/* Header cu Avatar */}
      <ListItem className="drawer-item" style={{ cursor: 'default' }}>
        <ListItemIcon>
          <Avatar sx={{ bgcolor: "#9ccddc", color: "#062c43" }}>
            {user?.nume?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
        </ListItemIcon>
        <ListItemText
          primary={user?.nume || 'Utilizator'}
          secondary={user?.elev ? "Elev" : "Profesor"}
        />
      </ListItem>

      <Divider className="drawer-divider" />

      <ListItem button className="drawer-item" onClick={() => navigate('/')}>
        <ListItemIcon className="drawer-icon"><Home /></ListItemIcon>
        <ListItemText primary="Pagina principală" />
      </ListItem>

      <ListItem button className="drawer-item" onClick={() => navigate('/cursuri-personale')}>
        <ListItemIcon className="drawer-icon"><School /></ListItemIcon>
        <ListItemText primary="Cursurile mele" />
      </ListItem>

      {!user.elev && (
        <ListItem button className="drawer-item" onClick={() => navigate('/teme')}>
          <ListItemIcon className="drawer-icon"><Assignment /></ListItemIcon>
          <ListItemText primary="Teme de evaluat" />
        </ListItem>
        
      )}

      {!user.elev && (<ListItem button className="drawer-item" onClick={() => navigate('/finante')}>
        <ListItemIcon className="drawer-icon"><MonetizationOn /></ListItemIcon>
        <ListItemText primary="Finante" />
      </ListItem>)}

       {user.elev && (<ListItem button className="drawer-item" onClick={() => navigate('/abonamente')}>
        <ListItemIcon className="drawer-icon"><MonetizationOn /></ListItemIcon>
        <ListItemText primary="Abonamente" />
      </ListItem>)}

      <ListItem button className="drawer-item" onClick={() => navigate('/setari')}>
        <ListItemIcon className="drawer-icon"><Settings /></ListItemIcon>
        <ListItemText primary="Setări cont" />
      </ListItem>

      {/* Spacer + Logout */}
      <Box sx={{ flexGrow: 1 }} />
      <Divider className="drawer-divider" />
      <ListItem button className="drawer-item" onClick={handleLogout}>
        <ListItemText primary="Deconectare" />
      </ListItem>
    </List>
  );

  return (
    <div className="menu-container">
      <IconButton edge="start" className="menu-button" onClick={toggleDrawer('left', true)}>
        <Menu />
      </IconButton>

      <Drawer
        anchor="left"
        open={state.left}
        onClose={toggleDrawer('left', false)}
        onOpen={toggleDrawer('left', true)}
        className="drawer-container"
      >
        {list('left')}
      </Drawer>
    </div>
  );
}

/*import './Drawer.css';
import React, { useEffect, useState } from 'react';
import {
  SwipeableDrawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton
} from '@mui/material';

import {
  School,
  Assignment,
  MonetizationOn,
  Settings,
  Home,
  Menu
} from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';

export default function StudySpaceDrawer() {
  const [state, setState] = React.useState({ left: false });
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      try {
        setUser(JSON.parse(userDataString));
      } catch (error) {
        console.error("Eroare la parsarea userData:", error);
      }
    }
  }, []);

  const isLoggedIn = !!user;

  if (!isLoggedIn) return null;

  const toggleDrawer = (anchor, open) => (event) => {
    if (event?.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
    setState({ ...state, [anchor]: open });
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    navigate('/autentificare');
    window.location.reload()
  };

  const list = (anchor) => (
    <List className="drawer-list">
      <ListItem button className="drawer-item" onClick={() => navigate('/')}>
        <ListItemIcon className="drawer-icon"><Home /></ListItemIcon>
        <ListItemText primary="Pagina principală" />
      </ListItem>

      <ListItem button className="drawer-item" onClick={() => navigate('/cursuri')}>
        <ListItemIcon className="drawer-icon"><School /></ListItemIcon>
        <ListItemText primary="Cursurile mele" />
      </ListItem>

      {!user.elev && (
        <ListItem button className="drawer-item" onClick={() => navigate('/teme')}>
          <ListItemIcon className="drawer-icon"><Assignment /></ListItemIcon>
          <ListItemText primary="Teme de evaluat" />
        </ListItem>
      )}

      <ListItem button className="drawer-item" onClick={() => navigate('/abonamente')}>
        <ListItemIcon className="drawer-icon"><MonetizationOn /></ListItemIcon>
        <ListItemText primary="Abonamente" />
      </ListItem>

      <ListItem button className="drawer-item" onClick={() => navigate('/setari')}>
        <ListItemIcon className="drawer-icon"><Settings /></ListItemIcon>
        <ListItemText primary="Setări cont" />
      </ListItem>

      <Divider className="drawer-divider" />

      <ListItem button className="drawer-item" onClick={handleLogout}>
        <ListItemText primary="Deconectare" />
      </ListItem>
    </List>
  );

  return (
    <div className="menu-container">
      <IconButton edge="start" className="menu-button" onClick={toggleDrawer('left', true)}>
        <Menu />
      </IconButton>

      <SwipeableDrawer
        anchor="left"
        open={state.left}
        onClose={toggleDrawer('left', false)}
        onOpen={toggleDrawer('left', true)}
        className="drawer-container"
      >
        {list('left')}
      </SwipeableDrawer>
    </div>
  );
}

/*
export default function StudySpaceDrawer() {
  const [state, setState] = React.useState({
    left: false,
  });

  const userData = JSON.parse(localStorage.getItem('userData') || '{}')

  const toggleDrawer = (anchor, open) => (event) => {
    if (event?.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <List className="drawer-list">
      <ListItem button className="drawer-item">
        <ListItemIcon className="drawer-icon"><Home /></ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>

      <ListItem button className="drawer-item">
        <ListItemIcon className="drawer-icon"><School /></ListItemIcon>
        <ListItemText primary="Cursurile mele" />
      </ListItem>

      <ListItem button className="drawer-item">
        <ListItemIcon className="drawer-icon"><Assignment /></ListItemIcon>
        <ListItemText primary="Teme de evaluat" />
      </ListItem>

      <ListItem button className="drawer-item">
        <ListItemIcon className="drawer-icon"><MonetizationOn /></ListItemIcon>
        <ListItemText primary={userData?.elev ? 'Abonamente': 'Finante'} />
      </ListItem>

      <ListItem button className="drawer-item">
        <ListItemIcon className="drawer-icon"><Settings /></ListItemIcon>
        <ListItemText primary="Setări cont" />
      </ListItem>

      <Divider className="drawer-divider" />

      <ListItem button className="drawer-item">
        <ListItemText primary="Deconectare" />
      </ListItem>
    </List>
  );

  return (

  <div className="menu-container">
  <IconButton
    edge="start"
    className="menu-button"
    onClick={toggleDrawer('left', true)}
  >
    <Menu />
  </IconButton>


      <SwipeableDrawer
        anchor="left"
        open={state.left}
        onClose={toggleDrawer('left', false)}
        onOpen={toggleDrawer('left', true)}
        className="drawer-container"
      >
        {list('left')}
      </SwipeableDrawer>
    </div>
  );
}

*/
