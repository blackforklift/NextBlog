"use client"
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styles from "./featured.module.css"

export default function featured() {
  return (
    <div className={styles.containerStyle}>
    <Typography style={{ margin: "1rem 0 2.5rem 0" }} variant="h3" >
      <b>Hey, Welcome to dilantech!</b> Learn With Me.
    </Typography>
    <Card sx={{ maxWidth: 1000,backgroundColor:"var(--bg)",alignContent:"center",justifyContent:"center"}}>
      <CardMedia
        sx={{ height: 150 }}
        image="/p1.jpeg"
        title="green iguana"
      />
      <CardContent>
        <Typography sx={{color:"var(--textColor)",fontWeight:"bold"}} gutterBottom variant="h5" component="div">
        Lorem ipsum dolor sit, amet consectetur
        </Typography>
        <Typography sx={{color:"var(--textColor)"}} variant="body1" color="text.secondary">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cupiditate, quam nisi magni ea laborum inventore
              voluptatum laudantium repellat ducimus unde aspernatur fuga. Quo, accusantium quisquam! Harum unde sit
              culpa debitis.
        </Typography>
      </CardContent>
      <CardActions>
      
        <Button size="small">read more</Button>
      </CardActions>
    </Card>
    </div>
  );
}