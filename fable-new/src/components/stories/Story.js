import { AppBar, Box, Card, CardMedia, Grid, Paper, Typography, makeStyles, CardContent, CardActionArea } from "@material-ui/core";
import { Stack } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const useStyles = makeStyles({
  card: {
    maxWidth: 250,
    height: "auto",
    width: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 5,
    border: "1px solid #000",
  },
  media: {
    height: "300px",
    width: "100%",
  },
  title: {
    border: " 0px #fff",
    width: "300px",
  },
  nameBox: {
    marginRight: "1000px",
  },
});

const Story = () => {
  const { id } = useParams();
  const [storyData, setStoryData] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    async function getStoryData() {
      const { data } = await axios.get(`/api/stories/${id}`);
      console.log(data);
      setStoryData(data);
    }
    getStoryData();
  }, [id]);

  if (storyData) {
    console.log(storyData);
    return ( 
 
      <Grid item xs={12} md={6}>
      <CardActionArea component="a" href="#">
        <Card sx={{ display: 'flex' }}>
          <CardContent sx={{ flex: 1 }}>
            <Typography component="h2" variant="h5">
              {storyData.story.title}
            </Typography>
            {/* <Typography variant="subtitle1" color="text.secondary">
              {post.date}
            </Typography> */}
            <Typography variant="subtitle1" paragraph>
              {storyData.creator.displayName}
            </Typography>
            <Typography variant="subtitle1" color="primary">
            {storyData.story.shortDescription}
            </Typography>
          </CardContent>
          <CardMedia
            component="img"
            sx={{ width: 160, display: { xs: 'none', sm: 'block' } }}
            image={storyData.story.coverImage} 
            alt="image"
          />
        </Card>
      </CardActionArea>
    </Grid>
     
    );
  }
};

export default Story;
