import { AppBar, Box, Card, CardMedia, Grid, Paper, Typography } from "@material-ui/core";
import { Stack } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Story = () => {
  const { id } = useParams();
  const [storyData, setStoryData] = useState(null);

  useEffect(() => {
    async function getStoryData() {
      const { data } = await axios.get(`/api/stories/${id}`);
      setStoryData(data);
    }
    getStoryData();
  }, [id]);

  if (storyData) {
    console.log(storyData);
    return (
      <div>
        <Paper
          elevation={10}
          sx={{
            bgcolor: "background.default",
            display: "grid",
            gridTemplateColumns: { md: "1fr 1fr" },
            gap: 2,
          }}
        >
          <Grid container justifyContent="center">
            <Typography variant="h1">{storyData.story.title}</Typography>
            <Card>
              <img src={"/public" + storyData.story.coverImage} />
            </Card>
          </Grid>
        </Paper>
        <Grid container justifyContent="center">
          <Stack direction={"row"} spacing={4}>
            <Box>
              <Typography variant="subtitle">{storyData.story.shortDescription}</Typography>
            </Box>
          </Stack>
        </Grid>
      </div>
    );
  }
};

export default Story;
