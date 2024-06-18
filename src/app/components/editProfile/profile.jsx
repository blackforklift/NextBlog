"use client";
import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, Typography, Box, Avatar, IconButton, CircularProgress } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';

const getData = async (slug) => {
  const res = await fetch(`/api/profile/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed");
  }

  return res.json();
};

const updateData = async (slug, updatedData) => {
  const res = await fetch(`/api/profile/${slug}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  });

  if (!res.ok) {
    throw new Error("Failed to update");
  }

  return res.json();
};

const Profile = ({ slug }) => {
  const [data, setData] = useState(null);
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);
  const [inputWidth, setInputWidth] = useState('auto');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getData(slug);
        setData(result);
        setName(result.name);
        setImage(result.image);
        setInputWidth(calculateInputWidth(result.name));
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    fetchData();
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedData = { name, image };
      const result = await updateData(slug, updatedData);
      setData(result); // Update local state with the new data
      alert('Profile updated successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to update profile');
    }
    setLoading(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    setInputWidth(calculateInputWidth(e.target.value));
  };

  const calculateInputWidth = (value) => {
    return `${value.length + 2}ch`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data) {
    return <div>Error loading data</div>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Profile</Typography>
      <Box sx={{ mb: 4, mt: 2, textAlign: 'center', position: 'relative', display: 'inline-block' }}>
        <Avatar src={image} alt="Profile" sx={{ width: 100, height: 100 }} />
        <IconButton
          sx={{
            position: 'absolute',
            bottom: -5,
            right: -12,
            backgroundColor: 'var(--softie)',
            '&:hover': {
              backgroundColor: 'var(--myTextColor)',
            },
            width: 40,
            height: 40
          }}
          onClick={handleIconClick}
        >
          <UploadIcon sx={{ fontSize: 20, color: 'white' }} />
        </IconButton>
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </Box>
      <Typography variant="body1">Email: {data.email}</Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ mt: 1, mb: 2, "& .MuiOutlinedInput-root": { color: "var(--textColor)" }}}>
          <TextField
            label="Name"
            variant="outlined"
            style={{ color: "var(--softie)" }}
            value={name}
            onChange={handleNameChange}
            color='success'
          />
        </Box>
        <Button 
          type="submit" 
          variant="contained" 
          sx={{ backgroundColor: 'var(--my2ndTextColor)', '&:hover': {
              backgroundColor: 'var(--softie)',
            }, fontSize: '0.875rem', padding: '6px 12px', minWidth: '64px' }} 
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Update Profile'}
        </Button>
      </form>
    </Box>
  );
};

export default Profile;
