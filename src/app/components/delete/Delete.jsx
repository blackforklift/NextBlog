import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';

const Delete = ({ item }) => {
  const [open, setOpen] = React.useState(false);
  const [successOpen, setSuccessOpen] = React.useState(false);
  const router = useRouter();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSuccessClose = () => {
    setSuccessOpen(false);
    router.push('/');
    
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/posts?id=${item.id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
      });
      handleClose();

      if (res.status === 200) {
        const data = await res.json();
        console.log("Successfully deleted", data);
        setSuccessOpen(true);
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
          {"You are about to delete this post, are you sure?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={handleDelete} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={successOpen}
        onClose={handleSuccessClose}
        aria-labelledby="success-dialog-title"
        aria-describedby="success-dialog-description"
      >
        <DialogTitle id="success-dialog-title">
          {"Success"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="success-dialog-description">
            Blog post deleted successfully.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSuccessClose} autoFocus>
           Homepage
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Delete;
