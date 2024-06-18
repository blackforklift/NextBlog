
import Link from "next/link";
import styles from "../homepage.module.css";
import Featured from "../components/featured/Featured";
import CardList from "../components/cardList/CardList";
import Menu from "../components/menu/Menu";
import MenuCategories from "../components/menuCategories/MenuCategories"


export default function Home({searchParams}) {

  const page = parseInt(searchParams.page) || 1;
  return <div className={styles.container}>
          <MenuCategories/>
  
    <div className={styles.content}>
        <CardList page={page}/>
    
        <Menu />

    </div>

  </div>;
}
