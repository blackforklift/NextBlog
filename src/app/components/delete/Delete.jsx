import React from 'react'
import { useState } from "react";
import styles from "./delete.module.css";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import DeleteIcon from '@mui/icons-material/Delete';
const Delete = ({item}) => {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

    const handleDelete = async () => {
        try {
          const res = await fetch(`/api/posts?id=${item.id}`, {
            method: "DELETE",
            headers: {
              "Content-type": "application/json",
            },
          });
          handleClose()
    
          if (res.status === 200) {
            const data = await res.json();
            console.log("successfully deleted", data);

            router.refresh();
          }
        } catch (error) {
          console.error("Error deleting post:", error);
        }
      };

  return (
    <>
    <Button variant="outlined" onClick={handleClickOpen}>
        Delete
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"You are about the delete this post, are you sure?"}
        </DialogTitle>
        
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={handleDelete} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Delete