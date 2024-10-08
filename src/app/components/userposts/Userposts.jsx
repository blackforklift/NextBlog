import React from "react";
import styles from "./userposts.module.css";
import Card from "../card/Card";

const Userposts = ({ posts }) => {
  if (!posts) {
    return <div>Loading posts...</div>; 
  }

  return (
    <div className={styles.container}>
      <div className={styles.posts}>
        {posts.length > 0 ? (
          posts.map((item) => <Card key={item._id} item={item} />)
        ) : (
          <div>No posts available</div> 
        )}
      </div>
    </div>
  );
};

export default Userposts;
