"use client";
import React, { useContext, useState, useEffect } from "react";
import { PostDataContext } from "../../context/PostDataContext";
import Toc from "../toc/Toc";
import styles from "./Sidebar.module.css";

const Sidebar = ({ onToggle }) => {
  const { postData } = useContext(PostDataContext);
  const [isVisible, setIsVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleSidebar = () => {
    const newState = !isVisible;
    setIsVisible(newState);
    onToggle(newState); // Notify parent component of the toggle state
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!postData) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <button
        onClick={toggleSidebar}
        className={`${styles.toggleButton} ${scrolled ? styles.scrolled : ""}`}
      >
        {isVisible ? "<" : scrolled ? ">" : "Contents"}
      </button>
      {isVisible && (
        <div className={styles.sidebar}>
          <Toc data={postData.desc} />
        </div>
      )}
    </>
  );
};

export default Sidebar;
