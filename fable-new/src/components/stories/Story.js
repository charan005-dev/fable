import {
  AppBar,
  Box,
  Card,
  CardMedia,
  Grid,
  Paper,
  Typography,
  makeStyles,
  CardContent,
  Button,
} from "@material-ui/core";
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
      <div>
        <Paper
          elevation={20}
          sx={{
            bgcolor: "background.default",
            display: "grid",
            gridTemplateColumns: { md: "1fr 1fr" },
            gap: 2,
          }}
        >
          <Grid container justifyContent="center">
            <Stack direction={"row"} spacing={1}>
              <Card className={classes.card}>
                <CardMedia className={classes.media} component="img" image={storyData.story.coverImage} />
              </Card>
              <Card className={classes.title}>
                <CardContent>
                  <Typography variant="h5">{storyData.story.title}</Typography>
                  <Link to="/libraries/me">
                    <Button className={classes.card.button} variant="contained">
                      Start Reading
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Paper>
        <br />
        <br />
        <Grid container justifyContent="center">
          <Stack direction={"column"} spacing={4}>
            {/* <Typography variant="h6">{storyData.creator}</Typography> */}
            <Box className={classes.nameBox}>
              <Link to={`/users/${storyData.creator._id}`}>{storyData.creator.displayName}</Link>
            </Box>
            <Typography variant="subtitle">{storyData.story.shortDescription}</Typography>
          </Stack>
        </Grid>
      </div>
    );
  }
};

export default Story;
