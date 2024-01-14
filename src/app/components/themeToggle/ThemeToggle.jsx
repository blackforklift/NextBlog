"use client"
import React, { useContext } from 'react';
import { IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import { ThemeContext } from "../../context/ThemeContext"

const ThemeToggle = () => {
  const { toggle, theme } = useContext(ThemeContext);

  return (
    <IconButton onClick={toggle} color="inherit">
      {theme === 'light' ? <Brightness4Icon /> : <WbSunnyIcon />}
    </IconButton>
  );
};

export default ThemeToggle;
