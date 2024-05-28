"use client"
import Image from "next/image";
import { useSession } from "next-auth/react";
import styles from "./card.module.css";
import Link from "next/link";
import Delete from "../delete/Delete";
import { Button } from "@mui/material";

const Card = ({ item }) => {
  const { data: session, status } = useSession();

  return (
    <div className={styles.container}>
      {item.img && (
        <div className={styles.imageContainer}>
          <Image src={item.img} alt="" fill className={styles.image} />
        </div>
      )}
      <div className={styles.textContainer}>
        <div className={styles.detail}>
          <span className={styles.date}>
            {item.createdAt.substring(0, 10)} -{" "}
          </span>
          <span className={styles.category}>{item.catSlug}</span>
        </div>
        <div className={styles.titlecontainer}>
          <Link href={`/posts/${item.slug}`}>
            <h1>{item.title}</h1>
          </Link>
          {status === "authenticated" &&
            session.user.email === item.userEmail && (<div>   
             <Delete key={item._id} item={item} />
             <Button color="secondary" href={`/write/${item.slug}`} >edit</Button>
        
             </div>
          
            )}
        </div>
        <div
          className={styles.desc}
          dangerouslySetInnerHTML={{
            __html: item?.desc.substring(0, 140) + "...",
          }}
        />
        <Link href={`/posts/${item.slug}`} className={styles.link}>
          Read More
        </Link>
        <br />
      </div>
    </div>
  );
};

export default Card;
