import React from "react";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import AuthLinks from '../authLinks/AuthLinks';
import styles from "./dropDown.module.css"
import { useSession } from "next-auth/react";



export default function Dropdown() {


  const { data:session } = useSession();


  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {

    setAnchorEl(null);
  };

  return (
    <div>
      <Button className={styles.links} 
        id="demo-positioned-button"
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
       { session !== null ? <img className={styles.avatar} src={session&&session.user.image}></img>:"Login"} 

      </Button>

      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={
    {ml:"8px", mt: "39px", "& .MuiMenu-paper": 
      { backgroundColor: "var(--bg)", }, 
    }
  }
      >
       <AuthLinks />
      </Menu>
    </div>
  );
}
