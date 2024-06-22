"use client"
import styles from "./navbar.module.css";
import Image from "next/image";
import Link from "next/link";
import AuthLinks from "../authLinks/AuthLinks";
import ThemeToggle from "../themeToggle/ThemeToggle";
import { ThemeContext } from "../../context/ThemeContext"
import React, { useContext } from "react";
import Dropdown from "../dropdown/Dropdown"


const Navbar = () => {

  const { theme, toggle } = useContext(ThemeContext);
  return (
    <div className={styles.container}>

      <div className={styles.links}>
        <ThemeToggle />
      
        <Link href="/" className={styles.link}>Homepage</Link>
   
        <Link href="/" className={styles.link}>About</Link>
     
       <Dropdown></Dropdown>
      </div>
    </div>
  );
};

export default Navbar;