"use client"

import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styles from "./featured.module.css"
import { purple } from '@mui/material/colors';

export default function featured() {
  const [latestPost, setLatestPost] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/posts');
        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await res.json();
       
        const latest = data.posts[0];
        setLatestPost(latest);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.containerStyle}>
      <Typography className='boldTitle' style={{ margin: "1rem 0 2.5rem 0" }} variant="h3">
        <b style={{color:'var(--my2ndTextColor)'}}>Hey, Welcome to DilanTech!</b> Explore With Me.
      </Typography>
      {latestPost && (
        <Card sx={{ maxWidth: 1000, backgroundColor: "var(--bg)", alignContent: "center", justifyContent: "center" }}>
          <CardMedia
            sx={{ height: 150 }}
            image={latestPost.img} // Assuming there's an image URL in the latest post data
            title="hot"
          />
          <CardContent>
            <Typography sx={{ color: "var(--textColor)", fontWeight: "bold" }} gutterBottom variant="h5" component="div">
              {latestPost.title}
            </Typography>
            <Typography sx={{ color: "var(--textColor)" }} variant="body1" color="text.secondary">
            <div
          className={styles.desc}
          dangerouslySetInnerHTML={{
            __html: latestPost?.desc.substring(0, 140) + "...",
          }}
        />
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" href={`/posts/${latestPost.slug}`}>Read more</Button>
          </CardActions>
        </Card>
      )}
    </div>
  );
}
