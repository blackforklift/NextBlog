import React from 'react'
import styles from './menu.module.css'
import MenuPosts from '../menuPosts/MenuPosts';
import MenuCategories from '../menuCategories/MenuCategories';

const Menu = () => {
  return (
    <div className={styles.container}>
    <div>
    <h2 className={styles.subtitle}>{"What's hot"}</h2>
 
      <h1 className={styles.title}>Most Popular</h1>
      <MenuPosts withImage={false} />
    </div>
    <div>
    <h2 className={styles.subtitle}>Discover by topic</h2>
      <h1 className={styles.title}>Categories</h1>
      <MenuCategories />
    </div>
    <div>
    <h2 className={styles.subtitle}>Chosen by the editor</h2>
      <h1 className={styles.title}>Editors Pick</h1>
      <MenuPosts withImage={true} />
    </div>
     
    </div>
  );
};

export default Menu