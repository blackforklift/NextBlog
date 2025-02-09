"use client";
import React, { useState, useEffect, useRef, useContext } from "react";

import {
  Button,
  Typography,
  Avatar,
  IconButton,
  CircularProgress,
} from "@mui/material";
import Box from "@mui/joy/Box";
import Textarea from "@mui/joy/Textarea";
import UploadIcon from "@mui/icons-material/Upload";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const fetchProfileData = async (email) => {
  try {
    const res = await fetch(`/api/profile/${email}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch profile: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return null;
  }
};

const updateProfileData = async (email, updatedData) => {
  try {
    const res = await fetch(`/api/profile/${email}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!res.ok) throw new Error(`Failed to update profile: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error("Error updating profile:", error);
    return null;
  }
};

const EditProfile = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login"); 
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      const result = await fetchProfileData(session.user.email);
      if (result) {
        setProfile(result);
        setName(result.name);
        setImage(result.image);
        setDescription(result.desc || ""); 
      }
      setLoading(false);
    };

    fetchData();
  }, [session, status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedData = { name, image, desc: description }; 
    const result = await updateProfileData(session.user.email, updatedData);

    if (result) {
      setProfile(result);
      setSuccessMessage("Profile updated successfully!");

      setTimeout(() => {
        router.push(`/profile/${session.user.email}`);
      }, 1000); 
    } else {
      setSuccessMessage("Failed to update profile");
    }

    setLoading(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleIconClick = () => fileInputRef.current.click();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Typography variant="h6" color="error">
        Error loading profile data
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Edit Profile
      </Typography>

      <Box
        sx={{
          mb: 4,
          mt: 2,
          textAlign: "center",
          position: "relative",
          display: "inline-block",
        }}
      >
        <Avatar src={image} alt="Profile" sx={{ width: 100, height: 100 }} />
        <IconButton
          sx={{
            position: "absolute",
            bottom: -5,
            right: -12,
            backgroundColor: "#1976D2",
            "&:hover": { backgroundColor: "#115293" },
            width: 40,
            height: 40,
          }}
          onClick={handleIconClick}
        >
          <UploadIcon sx={{ fontSize: 20, color: "white" }} />
        </IconButton>
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </Box>

      <Typography variant="body1">Email: {profile.email}</Typography>

      <form onSubmit={handleSubmit}>
  
        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography variant="body1">Name:</Typography>
          <Textarea
            name="name"
            placeholder="Enter your name..."
            fullWidth
            variant="outlined"
            color="primary"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Box>

  
        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography variant="body1">Description:</Typography>
          <Textarea
            name="description"
            placeholder="Enter your description..."
            fullWidth
            variant="outlined"
            color="primary"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Box>


        {successMessage && (
          <Typography variant="body1" color="success" sx={{ mt: 2 }}>
            {successMessage}
          </Typography>
        )}


        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: "#388E3C",
            "&:hover": { backgroundColor: "#2E7D32" },
            fontSize: "0.875rem",
            padding: "6px 12px",
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Update Profile"}
        </Button>
      </form>
    </Box>
  );
};

export default EditProfile;
