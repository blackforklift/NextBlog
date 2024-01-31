
import React from "react";
import styles from "./menuPosts.module.css"
import PopularPosts from "../popularPosts/PopularPosts";
import Link from "next/link";
import Image from "next/image";
import { grey } from "@mui/material/colors";

const getData = async (page, cat) => {
  const res = await fetch(
    `http://localhost:3000/api/posts`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed");
  }

  return res.json();
};

const MenuPosts = async ({withImage}) => {

  const { popularity } = await getData();

  
  return (
    <div className={styles.items}>
 {popularity?.map((item) => (
  <Link href={`/posts/${item.slug}`} className={styles.item}>
    {withImage && (
      <div className={styles.imageContainer}>
        <Image src={item.img} alt="" fill className={styles.image} />
      </div>
    )}
    <div className={styles.textContainer}>
      <span  className={`${styles.category}`} style={item.cat.color && { backgroundColor: item.cat.color }}
      >{item.catSlug}</span>
      <h3 className={styles.postTitle}>
      {item.title}
      </h3>
      <div className={styles.detail}>
        <span className={styles.username}>{item.user.name}</span>
        <span className={styles.date}> - {item.createdAt.substring(0, 10)}</span>
      </div>
    </div>
  </Link>
        ))}
   
    </div>
  );
};

export default MenuPosts;