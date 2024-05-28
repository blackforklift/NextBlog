"use client";
import Link from "next/link";
import styles from "./authLinks.module.css";
import { useContext,useState} from "react";
import { signOut, useSession } from "next-auth/react";
import { MenuItem } from "@mui/material";
import ThemeToggle from "../themeToggle/ThemeToggle";
import { ThemeContext } from "../../context/ThemeContext"


const AuthLinks = () => {
  const [open, setOpen] = useState(false);

  const { status } = useSession();
  const { theme } = useContext(ThemeContext);
  const itemColor ={color:theme=="dark"? "#ddd":"black"}
  return (
    <>
      {status === "unauthenticated" ? (
        <MenuItem sx={itemColor} className={styles.link}>
         <a href="/login">Login</a> 
        </MenuItem>
      ) : (
        <>
        <MenuItem sx={itemColor} >Profile</MenuItem>
        <MenuItem sx={itemColor}  className={styles.link}>
        <a href="/write">Write</a> 
        </MenuItem>
         
         <MenuItem sx={itemColor} className={styles.link} onClick={signOut}>
            Logout
          </MenuItem>
        </>
      )}
      <div className={styles.burger} onClick={() => setOpen(!open)}>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
      </div>
      {open && (
        <div className={styles.responsiveMenu}>
          <Link href="/">Homepage</Link>
          <Link href="/">About</Link>
          <Link href="/">Contact</Link>
          {status === "unauthenticated" ? (
            <Link href="/login">Login</Link>
          ) : (
            <>
              <Link className={styles.link} href="/write">Write</Link>
              <span className={styles.link}>Logout</span>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AuthLinks;