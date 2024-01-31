import Link from "next/link";
import React from "react";
import styles from "./menuCategories.module.css";
import Image from "next/image";


const getData = async () => {
  const res = await fetch("http://localhost:3000/api/categories", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed");
  }

  return res.json();
};
const MenuCategories = async () => {
  const {categories} = await getData();
  return (
    <div className={styles.container}>
      <div className={styles.categoryList}>
        {categories?.map((item) => (
          <Link
            href={`/blog?cat=${item.slug}`}
            className={`${styles.categoryItem}`}
            style={item.color && { backgroundColor: item.color }}
            key={item._id}
          >
           
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MenuCategories;