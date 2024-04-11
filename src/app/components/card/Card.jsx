"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import styles from "./card.module.css";
import Link from "next/link";


const Card = ({ item }) => {
  const { data: session, status } = useSession()
  const router = useRouter();
  


  const handledelete = async () => {
    try {
      const res = await fetch(`/api/posts?id=${item.id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
      });

      if (res.status === 200) {
        const data = await res.json();
        console.log("successfully deleted", data);
        router.push("/");
  
        
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

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
          {status === "authenticated" && session.user.email === item.userEmail &&
  (<button className={styles.deleteButton} onClick={handledelete}>Delete</button>)
}

       
          
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
