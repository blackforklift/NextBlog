import React from 'react'
import styles from './menu.module.css'
import MenuPosts from '../menuPosts/MenuPosts';
import MenuCategories from '../menuCategories/MenuCategories';

const Menu = () => {
  return (
    <div className={styles.container}>
      <div>
        <h2 className={styles.subtitle}>Trendy</h2>
        <h1 className={styles.title}>Most Popular</h1>
        <MenuPosts withImage={false} isPopular={true} />
      </div>

      {/* <div>
        <h2 className={styles.subtitle}>Discover by topic</h2>
        <h1 className={styles.title}>Categories</h1>
        <MenuCategories />
      </div> */}

      <div>
        <h2 className={styles.subtitle}>Chosen by me</h2>
        <h1 className={styles.title}>Editor&apos;s Pick</h1> {/* Fixed here */}
        <MenuPosts withImage={true} isPopular={false} />
      </div>
    </div>
  );
};

export default Menu;
