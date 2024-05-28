import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './delete.module.css';

const Updater = ({ item }) => {
  const router = useRouter();
  console.log("updaet item :",item)
  const openEditor = () => {
    router.push(`/write/${item.slug}`);
  };

  return (
    <button className={styles.deleteButton} onClick={openEditor}>Edit</button>
  );
};

export default Updater;
