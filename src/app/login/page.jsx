"use client";
import { SessionProvider } from "next-auth/react"
import { signIn, useSession } from "next-auth/react";
import styles from "./loginPage.module.css";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const { status ,data} = useSession();
  console.log(data,status)
  

  const router = useRouter();

  if (status === "loading") {
    return <div className={styles.loading}>Loading...</div>;
    console.log(data)
  }

  if (status === "authenticated") {
    router.push("/")
    console.log(data)
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.socialButton} onClick={() => signIn("google")}>
          Sign in with Google
        </div>
        <div className={styles.socialButton}>Sign in with Github</div>
      </div>
    </div>
  );
};

export default LoginPage;