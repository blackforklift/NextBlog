import Image from "next/image";
import Link from "next/link";
import React from "react";
import styles from "./popularPosts.module.css"

const PopularPosts =({key,item,withImage}) => {
    <Link key={key} href={`/posts/${item.slug}`} className={styles.item}>
    {withImage && (
      <div className={styles.imageContainer}>
        <Image src={item.img} alt="" fill className={styles.image} />
      </div>
    )}
    <div className={styles.textContainer}>
      <span className={`${styles.category} ${styles.travel}`}>{item.catSlug}</span>
      <h3 className={styles.postTitle}>
      {item.title}
      </h3>
      <div className={styles.detail}>
        <span className={styles.username}>{item.userEmail}</span>
        <span className={styles.date}> -{item.createdAt}</span>
      </div>
    </div>
  </Link>
  }

export default PopularPosts;