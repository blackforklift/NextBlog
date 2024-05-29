"use client"
import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, Typography, Box, Avatar, IconButton } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import styles from '../page.module.css'

const getData = async (slug) => {
  const res = await fetch(`http://localhost:3000/api/profile/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed");
  }

  return res.json();
};

const updateData = async (slug, updatedData) => {
  const res = await fetch(`http://localhost:3000/api/profile/${slug}`, {
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

const Page = ({ params }) => {
  const { slug } = params;
  const [data, setData] = useState(null);
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getData(slug);
        setData(result);
        setName(result.name);
        setImage(result.image);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = { name, image };
      const result = await updateData(slug, updatedData);
      setData(result); // Update local state with the new data
      alert('Profile updated successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to update profile');
    }
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

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Profile</Typography>
      <Box sx={{ mt: 2, textAlign: 'center', position: 'relative', display: 'inline-block' }}>
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
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Box>
        <Button type="submit" variant="contained" color="primary">Update Profile</Button>
      </form>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5">Preview</Typography>
        <Typography variant="body1">Name: {name}</Typography>
        {image && <Avatar src={image} alt="Profile" sx={{ width: 100, height: 100 }} />}
      </Box>
    </Box>
  );
};

export default Page;
