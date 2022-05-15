import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
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
  Chip,
  makeStyles,
  Fab,
} from "@material-ui/core";
import { Stack } from "react-bootstrap";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";

const useStyles = makeStyles({
  storyLink: {
    textDecoration: "none",
  },
  imageWrapper: {},
  stories: {
    marginLeft: "0%",
  },
  title: {
    border: "0px #fff",
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
  display: {
    paddingTop: 40,
  },
});

const AllLibraryStories = () => {
  const { currentUser } = useContext(AuthContext);
  let { libraryId } = useParams();
  let [libraryData, setLibraryData] = useState(null);
  let [force, setForce] = useState(0);
  const navigate = useNavigate();
  const classes = useStyles();

  useEffect(() => {
    async function getLibraryStories() {
      try {
        const { data } = await axios.get(
          `/api/libraries/library_stories/${libraryId}?owner=${currentUser.uid}`,
          {
            headers: { authtoken: await currentUser.getIdToken() },
          }
        );
        console.log(data.libraries);
        setLibraryData(data.libraries);
      } catch (e) {
        console.log(e);
        toast.error("Cannot find the library.", {
          theme: "dark",
        });
        setTimeout(() => navigate(`/libraries/me`), 300);
        return;
      }
    }
    getLibraryStories();
  }, [force]);

  const removeStory = async (storyId) => {
    try {
      const { data } = await axios.put(
        `/api/libraries/${libraryId}/removeStory`,
        {
          storyId,
        },
        {
          headers: {
            authtoken: await currentUser.getIdToken(),
          },
        }
      );
      console.log(data);
      let afterUpdate = data.library;
      if (afterUpdate) {
        // forcing a rerender
        toast.success("Successfully removed the story from library.", {
          theme: "dark",
        });
        setForce(force + 1);
      }
    } catch (e) {
      console.log(e);
      toast.error("Cannot remove story from library. Try again.", {
        theme: "dark",
      });
    }
  };

  if (libraryData) {
    return (
      <div className={classes.display}>
        <div>
          <Typography className={classes.title} subtitle={""}>
            {libraryData && libraryData.libraryName}
          </Typography>
        </div>
        <Divider />
        <br />
        {libraryData && libraryData.stories && libraryData.stories.length === 0 && (
          <Typography variant="body2">
            There are no stories in this library. <Link to={`/home`}>Start Exploring!</Link>
          </Typography>
        )}
        <Stack direction="column">
          {libraryData &&
            libraryData.stories &&
            libraryData.stories.map((libraryStory) => {
              if (libraryStory) {
                return (
                  <div>
                    <Paper elevation={10} className={classes.paper}>
                      <Grid className={classes.stories}>
                        <Card className={classes.card1}>
                          <div>
                            <div className={classes.card3} elevation={0}>
                              <Link to={`/stories/${libraryStory._id}`}>
                                <CardMedia
                                  className={classes.images}
                                  component="img"
                                  image={libraryStory.coverImage}
                                />
                              </Link>
                            </div>
                            <div className={classes.card4}>
                              <Link to={`/stories/${libraryStory._id}`}>
                                <Typography className={classes.content}>
                                  {" "}
                                  {libraryStory.title}{" "}
                                </Typography>
                              </Link>
                            </div>
                            <div>
                              <Typography>
                                {" "}
                                {libraryStory.shortDescription.length > 500
                                  ? libraryStory.shortDescription.substring(
                                      0,
                                      500
                                    ) + "..."
                                  : libraryStory.shortDescription}{" "}
                              </Typography>
                              <Fab variant="circular" onClick={() => removeStory(libraryStory._id)}>
                                <DeleteIcon />
                              </Fab>
                            </div>

                            <br />

                            <Stack direction="row" spacing={1}>
                              {libraryStory &&
                                libraryStory.genres &&
                                libraryStory.genres.map((genre) => {
                                  return (
                                    <Chip
                                      label={genre}
                                      size={"small"}
                                      color="info"
                                      onClick={() =>
                                        navigate(`/stories/choose/${genre}`)
                                      }
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
        </Stack>
      </div>
    );
  }
};

export default AllLibraryStories;
