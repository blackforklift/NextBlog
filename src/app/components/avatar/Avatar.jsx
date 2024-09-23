import React from "react";

import styles from "./avatar.module.css"
import { useSession } from "next-auth/react";

function Avatar({avatarStyle}) {
  const { data:session } = useSession();



  return (
    <div >
           { session !== null ? <img className={`${styles.avatar} ${avatarStyle}`} src={session&&session.user.image}></img>:"Login"} 
    </div>
  );
}

export default Avatar;
