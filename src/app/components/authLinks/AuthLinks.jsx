"use client";
import Link from "next/link";
import styles from "./authLinks.module.css";
import { useContext, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { MenuItem } from "@mui/material";
import { ThemeContext } from "../../context/ThemeContext";

const AuthLinks = () => {
  const [open, setOpen] = useState(false);

  const { status } = useSession();
  const { data: session } = useSession();

  const { theme } = useContext(ThemeContext);
  const itemColor = { color: theme === "dark" ? "#ddd" : "black" };


  const isAuthor = session?.user?.role === "author"; 
  const isAdmin = session?.user?.role === "admin"; 
  console.log(session.user)

  return (
    <>
      {status !== "unauthenticated" && (
        <>
          <MenuItem sx={itemColor}>
            <a href={`/profile/${session.user.email}`}>Profile</a>
          </MenuItem>
    
          {(isAuthor || isAdmin) && (
            <MenuItem sx={itemColor} className={styles.link}>
              <a href="/write">Write</a>
            </MenuItem>
          )}

     
          {isAdmin && (
            <MenuItem sx={itemColor} className={styles.link}>
              <a href="/admin/dashboard">Manage</a>
            </MenuItem>
          )}

          <MenuItem sx={itemColor} className={styles.link} onClick={() => signOut()}>
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
              {(isAuthor || isAdmin) && (
                <Link className={styles.link} href="/write">
                  Write
                </Link>
              )}
              {isAdmin && (
                <Link className={styles.link} href="/admin/dashboard">
                  Admin Dashboard
                </Link>
              )}
              <span className={styles.link} onClick={() => signOut()}>
                Logout
              </span>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AuthLinks;
