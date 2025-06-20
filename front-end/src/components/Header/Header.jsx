import React from 'react';
import './Header.css';
import { AppBar,
   Toolbar,
    Typography, 
    Avatar, 
    Button, 
    IconButton } from '@mui/material';

import FavoriteBorderIcon 
from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon 
from '@mui/icons-material/ShoppingCart';
import { useNavigate } 
from 'react-router-dom';
import MenuBookIcon 
from '@mui/icons-material/MenuBook';
import LibraryBooksIcon 
from '@mui/icons-material/LibraryBooks';
import logo from '../../assets/logo.png';
import Drawer from '../Drawer/Drawer';

export default function Header({ user, refreshHeader }) {
  const navigate = useNavigate();
  const isLoggedIn = Object.keys(user)!=0;
  const path = window.location.pathname
  console.log(path)

  return (
    <AppBar position="static" className="header-appbar">
      <Toolbar className="header-toolbar">

        <div className="header-left">
          {isLoggedIn && <Drawer user={user} refreshHeader={refreshHeader}/>}
          <img src={logo} alt="StudySpace Logo" className="header-logo" onClick={() => navigate('/')} />
          <Typography variant="h6" className="header-title" onClick={() => navigate('/')}>
            StudySpace
          </Typography>
        </div>

        <div className="header-right">
          {!isLoggedIn && (
            <Button
              variant="contained"
              className="login-button"
              onClick={() => navigate('/autentificare')}
            >
              Login
            </Button>
          )}

          {isLoggedIn && !user.elev && (
            <>
              <Button
                variant="contained"
                className="login-button"
                onClick={() => navigate('/creare-curs')}
              >
                Creare curs
              </Button>
              <Avatar sx={{ bgcolor: '#ced7e0', color: '#2f5972', cursor: 'pointer' }} onClick={() => navigate('/profil')} />
            </>
          )}

          {isLoggedIn && user.elev && (
            <>
            {path == '/cursuri' && <span>Credite : {user?.credite || 0}</span>}
             <IconButton
              onClick={() => navigate('/cursuri')}
              size="large"
              edge="end"
              color="inherit"
              aria-label="browse courses"
            >
              <LibraryBooksIcon />
            </IconButton>
            <IconButton
              onClick={() => navigate('/cursuri-personale')}
              size="large"
              edge="end"
              color="inherit"
              aria-label="my courses"
            >
              <MenuBookIcon />
            </IconButton>
           
              <IconButton onClick={() => navigate('/favorite')}>
                <FavoriteBorderIcon sx={{ color: '#ced7e0' }} />
              </IconButton>
              <IconButton onClick={() => navigate('/abonamente')}>
                <ShoppingCartIcon sx={{ color: '#ced7e0' }} />
              </IconButton>
              <Avatar sx={{ bgcolor: '#ced7e0', color: '#2f5972', cursor: 'pointer' }} onClick={() => navigate('/profil')} />
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
}
