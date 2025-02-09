import React from "react";
import styles from "./avatar.module.css";
import { useSession } from "next-auth/react";
import Image from "next/image";

function Avatar({ avatarStyle, src }) {
  const { data: session } = useSession();

  return (
    <div>
    {/* if src exists use it if not use current profile's picture */}
      {src ? (
        <Image className={`${styles.avatar} ${avatarStyle}`} src={src} alt="User Avatar" width={287} height={104} />
      ) : (
        session && session.user.image ? (
          <Image className={`${styles.avatar} ${avatarStyle}`} src={session.user.image} alt="User Avatar"  width={287} 
          height={104}  />
        ) : (
          "Login"
        )
      )}
    </div>
  );
}

export default Avatar;
