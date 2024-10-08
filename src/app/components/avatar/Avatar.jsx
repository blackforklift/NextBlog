import React from "react";
import styles from "./avatar.module.css";
import { useSession } from "next-auth/react";

function Avatar({ avatarStyle, src }) {
  const { data: session } = useSession();

  return (
    <div>
    {/* if src exists use it if not use current profile's picture */}
      {src ? (
        <img className={`${styles.avatar} ${avatarStyle}`} src={src} alt="User Avatar" />
      ) : (
        session && session.user.image ? (
          <img className={`${styles.avatar} ${avatarStyle}`} src={session.user.image} alt="User Avatar" />
        ) : (
          "Login"
        )
      )}
    </div>
  );
}

export default Avatar;
