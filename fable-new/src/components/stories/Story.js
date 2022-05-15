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
  Tooltip,
  CardActionArea,
} from "@material-ui/core";
import { Divider, Stack } from "@mui/material";
import ForumIcon from "@mui/icons-material/Forum";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Button from "@restart/ui/esm/Button";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useContext } from "react";
import { AuthContext } from "../../firebase/Auth";
import { BsVectorPen } from "react-icons/bs";

import VisibilityIcon from "@mui/icons-material/Visibility";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { Fab } from "@material-ui/core";

import Edit from "@mui/icons-material/Edit";
import { Chip } from "@material-ui/core";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import Comments from "./Comments";
import { toast } from "react-toastify";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Sugar from "sugar";
import CreateIcon from "@mui/icons-material/Create";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";

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
  editButton: {
    padding: 1,
    float: "left",
    marginTop: 10,
    marginRight: 10,
    backgroundColor: "black",
    color: "white",
    "&:hover": {
      backgroundColor: "white",
      color: "black",
      border: "solid 1px",
    },
  },
  media: {
    height: "100%",
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
    fontSize: "35px",
    fontFamily: "'Encode Sans Semi Expanded', sans-serif",
  },
  nameBox: {
    marginRight: "1000px",
  },
  button: {
    backgroundColor: "black",
    color: "white",
    width: "auto",
    maxWidth: "500px",
    maxHeight: "200px",
    marginTop: "1%",
    paddingTop: "15px",
    paddingBottom: "15px",
    paddingRight: "40px",
    paddingLeft: "40px",
    borderRadius: "35px",
    fontSize: "16px",
    textDecoration: "white",
    "&:hover": {
      backgroundColor: "black",
      color: "white",
      textDecoration: "white",
      fontWeight: "bold",
    },
  },
  card1: {
    width: "100%",
    marginLeft: "10%",
    paddingRight: "0%",
  },
  card2: {
    width: "70%",
    height: "100%",
    marginRight: "13vw !important",
    marginTop: "15%",
    marginBottom: "10%",
  },
  card3: {
    width: "7vw",
    height: "10vw",
    marginLeft: "5%",
    paddingRight: "0%",
  },
  card4: {
    height: "50%",
    width: "50%",
    marginLeft: "0%",
    paddingRight: "0%",
    paddingLeft: "0%",
  },
  similarStories: {
    padding: 6,
  },
  similarImages: {
    width: 57,
    height: 90,
    marginLeft: 18,
    marginTop: 18,
    marginBottom: 18,
    border: "0px solid black",
    borderRadius: "3px",
  },

  mainImage: {
    width: 140,
    height: 200,
    border: "0px solid black",
    borderRadius: "3px",
  },

  content1: {
    paddingLeft: "22%",
  },
  description: {
    marginBottom: "0%",
    marginTop: "2%",
    border: "0px solid",
    borderRadius: "6px",
    color: "black",
    width: "80",
  },
  titleside: {
    marginLeft: "-5%",

    width: "120%",
    alignContent: "center",
    alignSelf: "center",
    marginBottom: "10%",
    marginTop: "10%",
    textDecoration: "none",
    color: "black",
    border: "0px solid",
    paddingLeft: "2%",
    paddingRight: "2%",
    paddingTop: "2%",
    paddingBottom: "1%",
    borderRadius: "6px",
    elevation: "3",
    fontWeight: "bolder",
    "&:hover": {
      textDecoration: "none",
      color: "black",
    },
  },
  typo: {
    marginLeft: "26%",
    fontWeight: "bold",
  },

  author: {
    background: "black",
    textDecoration: "none",
    color: "white",
    border: "1px solid",
    paddingLeft: "13px",
    paddingRight: "13px",
    paddingTop: "5px",
    paddingBottom: "5px",
    borderRadius: "20px",
    elevation: "3",
    "&:hover": {
      backgroundColor: "black",
      color: "white",
      textDecoration: "white",
      fontWeight: "bold",
    },
  },

  box2: {
    marginLeft: "5%",
    marginTop: "2%",
    width: "100%",
  },

  recommendation: {
    marginBottom: "3%",
    textDecoration: "none",
    backgroundColor: "#EDEDED",
    border: "0px solid black",
    color: "white",
    borderRadius: "7px",

    "&:hover": {
      textDecoration: "none",
      color: "white",
    },
  },

  td: {
    textDecoration: "none",
    "&:hover": {
      textDecoration: "none",
    },
  },
  pen: {
    fontSize: "larger",
  },

  bold: {
    fontWeight: "bolder",
  },

  pen: {
    fontSize: "larger",
  },
});

const Story = () => {
  const { id } = useParams();
  const [storyData, setStoryData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const classes = useStyles();
  const [commentsModal, setCommentsModal] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function getStoryData() {
      try {
        const { data } = await axios.get(`/api/stories/${id}`, {
          headers: { authtoken: await currentUser.getIdToken() },
        });
        console.log(data);
        setStoryData(data);
      } catch (e) {
        console.log(e);
        if (e.response.status === 404)
          toast.error("The requested resource does not exist.", {
            theme: "dark",
          });
        setTimeout(() => navigate(`/home`), 500);
        return;
      }
    }
    getStoryData();
  }, [id]);

  useEffect(() => {
    async function getRecommendations() {
      if (storyData) {
        const { data } = await axios.get(
          `/api/stories/recommendations?genres=${
            storyData.story.genres ? storyData.story.genres : ""
          }`,
          {
            headers: {
              authtoken: await currentUser.getIdToken(),
            },
          }
        );
        console.log(data);
        setRecommendations(data.recommendations);
      }
    }
    getRecommendations();
  }, [storyData]);

  const buildFriendlyDate = (date) => {
    try {
      let dateObj = new Date(date);
      // if (isNaN(Date.parse(dateObj))) {
      //   console.log("Invalid date");
      //   return "";
      // }
      return Sugar.Date.relative(dateObj);
    } catch (e) {
      return "";
    }
  };

  if (storyData) {
    console.log(storyData);
    return (
      <span>
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
                  className={classes.mainImage}
                  component="img"
                  image={storyData.story.coverImage} 
                  alt="img"
                />
              </Card>
              <Card className={classes.title} elevation={0}>
                <CardContent>
                  <Tooltip
                    placement="right"
                    title={buildFriendlyDate(storyData.story.createdAt)}
                  >
                    <Typography
                      variant="h2"
                      component={"h1"}
                      className={classes.title1}
                    >
                      {storyData.story.title.length > 35
                        ? storyData.story.title.substring(0, 40) + "..."
                        : storyData.story.title}
                    </Typography>
                  </Tooltip>{" "}
                  <br></br> &nbsp;
                  <Typography variant="inherit">
                    {" "}
                    <FavoriteIcon /> &nbsp;
                    {" " + storyData.story.likedBy.length}
                  </Typography>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;
                  <Typography variant="inherit">
                    {" "}
                    <VisibilityIcon />
                    {" " + storyData.story.visitedBy.length}
                  </Typography>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;
                  <Tooltip
                    placement="right"
                    title="Average time it'll take for you to read this story"
                  >
                    <Typography variant="inherit">
                      {" "}
                      <AutoStoriesIcon />
                      {" ~" + storyData.story.accessorReadTime + " min"}
                    </Typography>
                  </Tooltip>
                  <br />
                  <br />
                  <Link to={`/stories/${storyData.story._id}/book`}>
                    <Button className={classes.button} elevation={20}>
                      <MenuBookIcon /> &nbsp; Start Reading{" "}
                    </Button>
                  </Link>
                  <span>
                    {currentUser.uid === storyData.story.creatorId && (  
                      <span>
                       <label hidden for="edit">
                       edit
                     </label>
                      <Fab 
                      id="edit"
                        className={classes.editButton}
                        onClick={() =>
                          navigate(`/stories/${storyData.story._id}/edit`)
                        }
                      >
                        <Edit />
                      </Fab> 
                      </span>
                    )}
                  </span>
                  <label hidden for="forum">
                    Forum
                  </label>
                  <Fab
                    id="forum"
                    className={classes.editButton}
                    onClick={() => setCommentsModal(true)}
                  >
                    <ForumIcon />
                  </Fab>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Paper>
        <br />
        <br />
        <Paper elevation={0} className={classes.paper}>
          <Grid>
            {/* <Stack direction={"row"} spacing={20}> */}

            <Stack direction={"row"} spacing={30}>
              {/* <Typography variant="h6">{storyData.creator}</Typography> */}
              <Card className={classes.card1} elevation={0}>
                {" "}
                <br />
                <CardContent>
                  {" "}
                  <Typography
                    variant="h4"
                    component={"h2"}
                    className={classes.bold}
                  >
                    Description
                  </Typography>
                  <br />
                  <Typography variant="h6" component={"h2"}>
                    {storyData.story.shortDescription}
                  </Typography>{" "}
                  <br />
                  <br />
                  <br />
                  <Stack direction="row" spacing={1}>
                    {storyData &&
                      storyData.story &&
                      storyData.story.genres &&
                      storyData.story.genres.map((genre) => {
                        return (
                          <Chip
                            label={genre}
                            size={"small"}
                            color="info"
                            onClick={() => navigate(`/stories/choose/${genre}`)}
                          />
                        );
                      })}
                  </Stack>
                </CardContent>{" "}
                <span>
                  <CardContent>
                    <Link
                      to={`/users/${storyData.creator._id}`}
                      class="text-decoration-none"
                      className={classes.author}
                    >
                      {storyData.creator.displayName}
                    </Link>
                    &nbsp;&nbsp;
                    <BsVectorPen className={classes.pen} />
                  </CardContent>
                </span>
              </Card>

              <Card className={classes.card2} elevation={0}>
                <CardContent>
                  <Typography
                    variant="h5"
                    component={"h2"}
                    className={classes.typo}
                  >
                    You might also like
                  </Typography>
                  <br />
                  <Divider />
                  <br />
                  {recommendations && recommendations.length === 0 && (
                    <Typography>No stories available.</Typography>
                  )}
                  {recommendations &&
                    recommendations.map((recommendation, idx) => {
                      if (recommendation._id !== id) {
                        return (
                          <div>
                            <Link
                              to={`/stories/${recommendation._id}`}
                              className={classes.td}
                            >
                              <Card
                                sx={{ display: "flex" }}
                                className={classes.recommendation}
                                elevation={2}
                                to
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    width: "150%",
                                  }}
                                >
                                  <CardMedia
                                    className={classes.similarImages}
                                    component="img"
                                    image={
                                      recommendation.coverImage
                                        ? recommendation.coverImage
                                        : "/fablefinal.png" 
                                    } 
                                    alt="img"
                                  />
                                  <Box className={classes.box2}>
                                    <CardContent>
                                      <Link
                                        to={`/stories/${recommendation._id}`}
                                        class="text-decoration-none"
                                        className={classes.titleside}
                                      >
                                        {recommendation.title}
                                      </Link>
                                    </CardContent>

                                    <Typography
                                      variant="caption"
                                      className={classes.description}
                                    >
                                      {recommendation.shortDescription.length >
                                      50
                                        ? recommendation.shortDescription.substring(
                                            0,
                                            50
                                          ) + "..."
                                        : recommendation.shortDescription}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Card>
                            </Link>
                          </div>
                        );
                      }
                      if (idx === recommendations.length - 1) {
                        return (
                          <div>
                            <Typography>No stories available.</Typography>
                          </div>
                        );
                      }
                    })}
                </CardContent>
              </Card>
            </Stack>
            {/* </Stack> */}
          </Grid>
        </Paper>
        <Comments
          storyId={id}
          open={commentsModal}
          existingComments={storyData.story.comments}
          handleClose={() => setCommentsModal(false)}
        />
      </span>
    );
  }
};

export default Story;
