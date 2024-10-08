import React, { useState, useEffect } from "react";
import styles from "./profile.module.css";
import Avatar from "../avatar/Avatar";
import { Button, Tabs, Tab } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Userposts from "../userposts/Userposts";

const getData = async (slug) => {
  const res = await fetch(`/api/profile/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch profile data");
  }

  return res.json();
};

const getPublishedPosts = async (slug) => {
  const res = await fetch(`/api/userposts/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch published posts");
  }

  return res.json();
};

const getSavedPosts = async (slug) => {
  const res = await fetch(`/api/savedposts/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch saved posts");
  }

  return res.json();
};

const getDrafts = async (slug) => {
  const res = await fetch(`/api/userdrafts/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch drafts");
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
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("published");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await getData(slug);
        setData(profileData);

        // Fetch the initial posts based on the active tab
        const fetchedPosts = await getPublishedPosts(slug);
        setPosts(fetchedPosts);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [slug]);

  useEffect(() => {
    const fetchTabData = async () => {
      try {
        let fetchedPosts;
        if (activeTab === "published") {
          fetchedPosts = await getPublishedPosts(slug);
        } else if (activeTab === "saved") {
          
          fetchedPosts = await getSavedPosts(slug);
        } else if (activeTab === "drafts") {
          fetchedPosts = await getDrafts(slug);
        }
        setPosts(fetchedPosts);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchTabData();
  }, [activeTab, slug]); // Fetch data whenever the active tab or slug changes

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading ... </div>;
  }

  const name = capitalizeName(data.name);
  let srcimage =data.image


  const handleBackClick = () => {
    router.back();
  };

  return (
    <div>
      <div className={styles.container}>
        <Button
          variant="text"
          onClick={handleBackClick}
          className={styles.backButton}
        >
          Back
        </Button>

        <Avatar
          avatarStyle={styles.cavatar}
          src={srcimage}
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
      <div className={styles.tab}>
        <Tabs
          value={activeTab}
          onChange={(event, newValue) => setActiveTab(newValue)}
        >
          <Tab label="Published Posts" value="published" />
          {session?.user?.email === data.email && (
            <Tab label="Drafts" value="drafts" />
          )}
          {session?.user?.email === data.email && (
            <Tab label="Saved Posts" value="saved" />
          )}
        </Tabs>
      </div>

      <Userposts posts={posts} />
    </div>
  );
}
