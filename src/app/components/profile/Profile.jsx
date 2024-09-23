import React, { useState, useEffect } from "react";
import styles from "./profile.module.css";
import Avatar from "../avatar/Avatar";
import { Button } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const getData = async (slug) => {
  const res = await fetch(`/api/profile/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed");
  }

  return res.json();
};

const capitalizeName = (name) => {
  return name.replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function Profile({ slug }) {
  const { data: session } = useSession();
  const router = useRouter();

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getData(slug)
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [slug]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading ... </div>;
  }

  const name = capitalizeName(data.name);

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div>
      <div className={styles.container}>
        <Button
          variant="text"
          onClick={handleBackClick}
          className={styles.backButton}>Back
          </Button>

        <Avatar
          avatarStyle={styles.cavatar}
          src={data.avatarUrl}
          alt={name}
          size="150px"
        />

        <div>
          <h3 className={styles.text}>{name}</h3>
        </div>
        <div className={styles.transparent}>
          <p>{data.desc}</p>
        </div>
      </div>
      <div className={styles.menu}>
        <Button variant="text" color="secondary">Published Posts</Button>
        <div>
          {session?.user?.email === data.email ? (
            <Button variant="text" color="secondary"> Saved Posts</Button>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}
