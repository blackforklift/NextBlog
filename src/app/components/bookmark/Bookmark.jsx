"use client";

import React, { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";

const Bookmark = ({ slug, postId }) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    //did user already save or not.
    const fetchBookmarkStatus = async () => {
      try {
        const res = await fetch(`/api/bookmarks/status?postId=${postId}`);
        const data = await res.json();
        setBookmarked(data.isBookmarked);
      } catch (error) {
        console.error("Error checking bookmark status:", error);
      }
    };

    fetchBookmarkStatus();
  }, [postId]);

  const toggleBookmark = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId }),
      });

      if (res.ok) {
        setBookmarked((prev) => !prev);
      } else {
        console.error("Failed to toggle bookmark");
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }

    setLoading(false);
  };

  return (
    <IconButton  sx={{ position: "inherit" }} onClick={toggleBookmark} color="primary" disabled={loading}>
      {bookmarked ? <BookmarkIcon sx={{ fontSize: 60 ,position: "inherit"}} /> : <BookmarkBorderIcon sx={{ fontSize: 60 }} />}
    </IconButton>
  );
};

export default Bookmark;
