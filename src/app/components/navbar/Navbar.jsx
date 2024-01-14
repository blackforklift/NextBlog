import React from "react";
import styles from "./navbar.module.css";
import Image from "next/image";
import Link from "next/link";
import AuthLinks from "../authLinks/AuthLinks";
import ThemeToggle from "../themeToggle/ThemeToggle";

const Navbar = () => {
  return (
    <div className={styles.container}>
    
      <div className={styles.logo}>Dilantech</div>
      <div className={styles.links}>
        <ThemeToggle />
        <Link href="/" className={styles.link}>EN</Link>
        <Link href="/" className={styles.link}>TR</Link>
        <Link href="/" className={styles.link}>Homepage</Link>
   
        <Link href="/" className={styles.link}>About</Link>
        <AuthLinks />
      </div>
    </div>
  );
};

export default Navbar;