import React, { useContext, useState, useEffect } from "react";
import axios from "axios";

import { Link, useNavigate, useParams } from "react-router-dom";

import { AuthContext } from "../../firebase/Auth";
import {
  Box,
  Card,
  CardActionArea,
  CardHeader,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Paper,
  Divider,
  TextField,
  makeStyles,
} from "@material-ui/core";
import { Chip } from "@material-ui/core";
import { Button, Stack } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";

const useStyles = makeStyles({
  storyLink: {
    textDecoration: "none",
  },
  imageWrapper: {},
  stories: {
    marginLeft: "0%",
  },
  title: {
    border: " 0px #fff",
    width: "auto",
    paddingRight: "100%",
  },
  stack: {
    width: "auto",
    height: "auto",
    paddingRight: "auto",
  },
  media: {
    height: "300px",
    width: "100%",
  },

  card1: {
    marginBottom: "1%",
  },
  text: {
    color: "grey",
    justifyContent: "center",
    marginLeft: "44%",
    marginRight: "auto",
  },
  box: {
    paddingLeft: "auto",
    marginLeft: "44%",
    marginRight: "100%",
  },
  title: {
    color: "black",
    justifyContent: "center",
    fontSize: "300%",
    paddingLeft: "40%",
  },
  paper1: {
    height: "10%",
    width: "5%",
    marginLeft: "5%",
    marginRight: "auto",
    borderRadius: 5,
    border: "0px solid #000",
    marginBottom: "10%",
    marginTop: "10%",
  },

  paper2: {
    width: "13%",
    marginLeft: "43.5%",
    paddingLeft: "auto",
    paddingRight: "auto",
  },
  paperfirst: {
    height: "350px",
    width: "auto",
    marginLeft: "60%",
    marginRight: "auto",
    borderRadius: 5,
    border: "0px solid #000",
    marginBottom: "1%",
    marginTop: "7%",
    maxHeight: "29vw",
    maxWidth: "10vw",
  },
  paper: {
    marginLeft: "10%",
    width: "80%",
    height: "100%",
  },
  media: {
    marginTop: "10%",
    marginBottom: "10%",
    height: "20%",
    width: "20%",
  },
  card3: {
    width: "5vw",
    height: "10vw",
    marginLeft: "5%",
    paddingRight: "0%",
  },
  card4: {
    marginTop: "-7%",
    height: "0%",
    width: "50%",
  },
  images: {
    display: "inline-block",
    verticalAlign: "top",
    margin: "30%",
    border: "solid 1px black",
    borderRadius: "5px",
    boxShadow: " 0px 5px 10px",
    float: "left",
    width: "10vw",
    height: "15vw",
    marginTop: "50%",
    marginBottom: "40%",
    marginLeft: "10%",
  },
  content: {
    paddingLeft: "20%",
    marginBottom: "5%",
    marginTop: "0% !important",
    fontWeight: "bold",
    fontSize: "25px",
  },
});

const AllStories = () => {
  const { currentUser } = useContext(AuthContext);
  const [pageNum, setPageNum] = useState(0);
  const [allStories, setAllStories] = useState(null);
  const classes = useStyles();
  const navigate = useNavigate();

  useEffect(() => {
    async function getAllPaginatedStories() {
      try {
        const { data } = await axios.get(`/api/stories/all_stories?skip=0&take=5`, {
          headers: { authtoken: await currentUser.getIdToken() },
        });
        console.log("all stories", data);
        setAllStories(data.stories);
      } catch (e) {
        console.log(e);
      }
    }
    getAllPaginatedStories();
  }, []);

  //   useEffect(() => {
  //     async function getNewData() {
  //       try {
  //         const { data } = await axios.get(`/api/stories/all_stories?skip=0&take=`, {
  //           headers: { authtoken: await currentUser.getIdToken() },
  //         });
  //         const copyState = allStories;
  //         for (const story of data.stories) {
  //           copyState.push(story);
  //         }
  //         console.log("next set", data);
  //         setAllStories(copyState);
  //         setPageNum(pageNo);
  //       } catch (e) {
  //         console.log(e);
  //       }
  //     }
  //     getNewData();
  //   }, []);

  const getNewData = async () => {
    try {
      let pageNo = pageNum + 1;
      const take = 5;
      const skip = take * pageNo;
      const { data } = await axios.get(`/api/stories/all_stories?skip=${skip}&take=${take}`, {
        headers: { authtoken: await currentUser.getIdToken() },
      });
      const copyState = allStories;
      for (const story of data.stories) {
        copyState.push(story);
      }
      console.log("next set", data);
      setAllStories(copyState);
      setPageNum(pageNo);
    } catch (e) {
      console.log(e);
    }
    // console.log("callingnext");
  };

  if (allStories) {
    return (
      <div id="scrollableDiv">
        <div>
          <Typography className={classes.title} subtitle={""}>
            All Stories
          </Typography>
        </div>
        <br />
        {/* <div
          id="scrollableDiv"
          style={{
            height: 300,
            overflow: "auto",
            display: "flex",
            flexDirection: "column-reverse",
          }}
        > */}
        {allStories &&
          allStories.map((allStory) => {
            if (allStory) {
              return (
                <div>
                  <Paper elevation={10} className={classes.paper}>
                    <Grid className={classes.stories}>
                      <Card className={classes.card1}>
                        <div>
                          <div className={classes.card3} elevation={0}>
                            <Link to={`/stories/${allStory._id}`}>
                              <CardMedia className={classes.images} component="img" image={allStory.coverImage} />
                            </Link>
                          </div>
                          <div className={classes.card4}>
                            <Link to={`/stories/${allStory._id}`}>
                              <Typography className={classes.content}> {allStory.title} </Typography>
                            </Link>
                          </div>
                          <div>
                            <Typography>
                              {" "}
                              {allStory.shortDescription.length > 500
                                ? allStory.shortDescription.substring(0, 500) + "..."
                                : allStory.shortDescription}{" "}
                            </Typography>
                          </div>
                          <br />

                          <Stack direction="row" spacing={1}>
                            {allStory &&
                              allStory.genres &&
                              allStory.genres.map((genre) => {
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
                        </div>
                      </Card>
                    </Grid>
                  </Paper>
                </div>
              );
            }
          })}
        <Button onClick={getNewData}>View More</Button>
        {/* </div> */}
      </div>
    );
  }
};

export default AllStories;
