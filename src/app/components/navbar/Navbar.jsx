"use client"
import styles from "./navbar.module.css";
import Link from "next/link";

import ThemeToggle from "../themeToggle/ThemeToggle";
import { ThemeContext } from "../../context/ThemeContext"
import React, { useContext } from "react";
import Dropdown from "../dropdown/Dropdown"
import Image from "next/image";


const Navbar = () => {

  const { theme } = useContext(ThemeContext);
  return (
    <div className={styles.container}>
    
   <Link href="/">
   <Image
          className={styles.logo2}
          src={theme === "light" ? "/logoforlight.png" : "/logofordark.png"}
          alt="DilanTech Logo"
          width={259} 
          height={96} 
        />
      </Link> 
      {/* <div className={styles.logo}>Dilantech</div> */}
      <div className={styles.links}>
        <ThemeToggle />
        {/* <Link href="/" className={styles.link}>EN</Link> */}
        <Link href="/" className={styles.link}>TR</Link>
        <Link href="/" className={styles.link}>Homepage</Link>
   
        <Link href="/" className={styles.link}>About</Link>
     
       <Dropdown></Dropdown>
      </div>
    </div>
  );
};

export default Navbar;