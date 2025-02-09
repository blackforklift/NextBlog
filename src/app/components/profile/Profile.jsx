import React, { useState, useEffect } from "react";
import styles from "./profile.module.css";
import Avatar from "../avatar/Avatar";
import { Button, Tabs, Tab, IconButton } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Userposts from "../userposts/Userposts";

import SettingsIcon from "@mui/icons-material/Settings";

const fetchPosts = async (tab, slug) => {
  const endpoints = {
    published: `/api/userposts/${slug}`,
    saved: `/api/userbookmarks/${slug}`,
    drafts: `/api/userdrafts/${slug}`,
  };

  try {
    const res = await fetch(endpoints[tab], { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch ${tab} posts`);
    return await res.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

const fetchProfileData = async (slug) => {
  try {
    const res = await fetch(`/api/profile/${slug}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch profile data");
    return await res.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

export default function Profile({ slug }) {
  const { data: session } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("published");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await fetchProfileData(slug);
        setProfile(profileData);

        const initialPosts = await fetchPosts("published", slug);
        setPosts(initialPosts);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchData();
  }, [slug]);

  useEffect(() => {
    const updatePosts = async () => {
      try {
        setPosts(await fetchPosts(activeTab, slug));
      } catch (error) {
        setError(error.message);
      }
    };
    updatePosts();
  }, [activeTab, slug]);

  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!profile) return <div className={styles.loading}>Loading...</div>;

  const handleBackClick = () => router.back();
  const handleEditProfile = () => router.push(`/editProfile/${slug}`);

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.topButtons}>
          <Button
            variant="text"
            onClick={handleBackClick}
            className={styles.backButton}
          >
            Back
          </Button>
          {session?.user?.email === profile.email && (
            <IconButton
              onClick={handleEditProfile}
              className={styles.settingsButton}
            >
              <SettingsIcon />
            </IconButton>
          )}
        </div>

        <Avatar
          avatarStyle={styles.cavatar}
          src={profile.image}
          alt={profile.name}
          size="150px"
        />
 {console.log(profile)}
        <h3 className={styles.text}>{profile.name}</h3>
        <p className={styles.transparent}>{profile.desc}</p>
       
      </div>

      <div className={styles.tab}>
        <Tabs
          value={activeTab}
          onChange={(event, newValue) => setActiveTab(newValue)}
        >
          <Tab label="Published Posts" value="published" />
          {session?.user?.email === profile.email && (
            <Tab label="Drafts" value="drafts" />
          )}
          {session?.user?.email === profile.email && (
            <Tab label="Saved Posts" value="saved" />
          )}
        </Tabs>
      </div>

      {posts.length > 0 ? (
        <Userposts posts={posts} />
      ) : (
        <p className={styles.noPostsMessage}>No posts found in this section.</p>
      )}
    </div>
  );
}
