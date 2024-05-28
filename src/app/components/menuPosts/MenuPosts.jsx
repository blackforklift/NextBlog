import React from "react";
import styles from "./menuPosts.module.css";
import Link from "next/link";
import Image from "next/image";

const getData = async (type) => {
  const res = await fetch(`http://localhost:3000/api/posts`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed");
  }

  const data = await res.json();
  return type === "popularity" ? data.popularity : data.posts;
};

const MenuPosts = async ({ withImage, isPopular }) => {
  const items = await getData(isPopular ? "popularity" : "posts");

  return (
    <div className={styles.items}>
      {items?.map((item) => (
        <Link key={item.id} href={`/posts/${item.slug}`} className={styles.item}>
          {withImage && (
            <div className={styles.imageContainer}>
              <Image src={item.img} alt="" fill className={styles.image} />
            </div>
          )}
          <div className={styles.textContainer}>
            <span
              className={`${styles.category}`}
              style={item.cat.color ? { backgroundColor: item.cat.color } : {}}
            >
              {item.catSlug}
            </span>
            <h3 className={styles.postTitle}>{item.title}</h3>
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
