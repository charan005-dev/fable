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
} from "@material-ui/core";
import { Stack } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Button from "@restart/ui/esm/Button";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const useStyles = makeStyles({
  card: {
    maxWidth: 250,
    height: "auto",
    width: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 5,
    border: "0px solid #000",
    marginBottom: "10%",
    marginTop: "7%",
  },
  media: {
    height: "300px",
    width: "100%",
  },
  title: {
    border: " 0px #fff",
    width: "auto",
    height: "auto",
    marginTop: "1px",
    paddingTop: "5%",
    fontFamily: "'Encode Sans Semi Expanded', sans-serif",
  },
  title1: {
    width: "auto",
    height: "auto",

    fontFamily: "'Encode Sans Semi Expanded', sans-serif",
  },
  nameBox: {
    marginRight: "1000px",
  },
  button: {
    backgroundColor: "black",
    color: "blanchedalmond",
    width: "90%",
    marginLeft: "10%",
    paddingTop: "5%",
    paddingBottom: "5%", 
    paddingRight:"5%", 
    paddingLeft:"5%",
    borderRadius: "35px",
    fontWeight: "bold",
    fontSize: "16px",
    textDecoration: "white",
    "&:hover": {
      backgroundColor: "blanchedalmond",
      color: "black",
      textDecoration: "white",
      fontWeight: "bold",
    },
  },
  card1: {
    width: "70%",
    marginLeft: "10%",
    paddingRight: "10%",
  },
  card2: {
    width: "15%",
    marginBottom: "100px",
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
        <br/> 
        <br/>
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
            <Stack direction={"row"} spacing={7}>
              <Card className={classes.card} elevation={15}>
                <CardMedia
                  className={classes.media}
                  component="img"
                  image={storyData.story.coverImage}
                />
              </Card>
              <Card className={classes.title} elevation={0}>
                <CardContent>
                  <Typography variant="h2" className={classes.title1}>
                    {storyData.story.title}
                  </Typography>{" "}
                  <br />
                  <br />
                  <Link to="/libraries/me">
                    <Button className={classes.button}>
                      {" "}
                      <MenuBookIcon /> &nbsp;&nbsp;Start Reading{" "}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Paper>
        <br />
        <br />
        <Paper
          elevation={0}
          sx={{
            bgcolor: "background.default",
            display: "grid",
            gridTemplateColumns: { md: "1fr 1fr" },
            gap: 2,
            height: "auto",
          }}
        >
          <Grid container justifyContent="center">
            <Stack direction={"row"} spacing={2}>
              {/* <Typography variant="h6">{storyData.creator}</Typography> */}
              <Card className={classes.card1} elevation={0}>
                <CardContent>
                  <Link to={`/users/${storyData.creator._id}`}>
                    {storyData.creator.displayName}
                  </Link>
                </CardContent>{" "}
                <br />
                <CardContent>
                  {" "}
                  <Typography variant="subtitle">
                    {storyData.story.shortDescription}
                  </Typography>{" "}
                </CardContent>
              </Card>

              <Card className={classes.card2} elevation={24}>
                <CardContent>
                  <Typography variant="subtitle">
                    Each time I refer to one of them, I make it a point to
                    stress to my students they are not universally true and
                    should always be challenged. My discomfort with these 3–5–7
                    models (as I like to call them) is not just from the
                    absurdity of trying to distill the complexity of the world’s
                    eternally evolving heritage of stories into single models,
                    which invariably are littered with caveats and exceptions.
                    No. My bigger concern is that the 3–5–7 models have largely
                    also become foundations for exclusion of certain stories—and
                    the focus on models is somewhat akin to the way in which
                    global economists spend years arguing about which capitalist
                    models work better, without giving any attention to the fact
                    that all successful capitalist nations were built on
                    inhumane exploitation of serfs, women, occupied lands,
                    slaves, children—and in more recent success stories like
                    Singapore and South Korea, underpaid labor and suppression
                    of civil liberties. Just as it is within the world of
                    fiction, focusing on the economic models and not the
                    historic biases and nuances is misleading.
                  </Typography>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Paper>
      </div>
    );
  }
};

export default Story;
