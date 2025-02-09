"use client";

import React, { useEffect, useState, useContext } from "react";
import styles from "./singlePage.module.css";
import Image from "next/image";
import { Button } from "@mui/material";
import Delete from "../../../components/delete/Delete";
import { useSession } from "next-auth/react";
import Comments from "../../../components/comments/Comments";
import { PostDataContext } from "../../../context/PostDataContext";
import Bookmark from "../../../components/bookmark/Bookmark";


const getData = async (slug) => {
  const res = await fetch(`http://localhost:3000/api/posts/${slug}?`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed");
  }

  return res.json();
};

const SinglePage = ({ params }) => {
  const { slug } = params;
  const { data: session, status } = useSession();
  const { postData, setPostData } = useContext(PostDataContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postData = await getData(slug);
        setPostData(postData);
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };

    fetchData();
  }, [slug, setPostData]);

  if (!postData) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.textContainer}>
        <div className={styles.bookmark}><Bookmark slug={slug} postId={postData.id} /></div>
          <div className={styles.header}>
            <h1 className={styles.title}>{postData?.title}</h1>

          
           
          </div>
        
          <div className={styles.user}>
            {postData?.user?.image && (
              <div className={styles.userImageContainer}>
                <Image
                  src={postData.user.image}
                  alt=""
                  fill
                  className={styles.avatar}
                />
              </div>
            )}
            <span className={styles.username}>{postData?.user.name}</span>
            <span className={styles.date}>
              {postData.createdAt.substring(0, 10)}
            </span>
          </div>

          {status === "authenticated" && session.user.email === postData.userEmail && (
            <div className={styles.crud}>
              <Delete key={postData._id} item={postData} />{" "}
              <div>
                <Button color="secondary" variant="outlined" href={`/write/${postData.slug}`}>
                  Edit
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.post}>
          <div dangerouslySetInnerHTML={{ __html: postData?.desc }} />

          <div className={styles.comment}>
            <Comments postSlug={slug} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePage;
