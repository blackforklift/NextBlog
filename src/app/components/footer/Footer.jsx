import React from "react";
import styles from "./footer.module.css";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <div className={styles.logo}>
          <Image className={styles.img} src="/logo.png" alt="dilan blog" width={50} height={50} />
          <h1 className={styles.logoText}>Dilantech</h1>
        </div>
        <p className={styles.desc}>
        Welcome to my extraordinary corner of the internet! As a curious soul passing through Earth, I love to explore things. So, this blog is a canvas for my soul to express itself.        </p>
        <div className={styles.icons}>
          <Image src="/LinkedIn.png" alt="" width={18} height={18} />
          <Image src="/instagram.png" alt="" width={18} height={18} />
         
          <Image src="/youtube.png" alt="Coming soon" width={18} height={18} />
        </div>
      </div>
      <div className={styles.links}>
        <div className={styles.list}>
          <span className={styles.listTitle}>Links</span>
          <Link href="/">Homepage</Link>
          <Link href="/">About</Link>
          <Link href="/">Contact</Link>
        </div>
      
        <div className={styles.list}>
          <span className={styles.listTitle}>Social</span>
          <Link href="/">LinkedIn</Link>
          <Link href="/">Instagram</Link>
          <Link href="/">Youtube</Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;