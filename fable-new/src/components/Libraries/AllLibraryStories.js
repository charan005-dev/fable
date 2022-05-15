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
} from "@material-ui/core";
import { Skeleton } from "@mui/material";
import { MDBCard, MDBCardTitle, MDBCardText, MDBCardBody, MDBCardImage, MDBRow, MDBCol } from "mdb-react-ui-kit";
import Hero from "../Hero";
import { Stack } from "react-bootstrap";

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

const AllLibraryStories = () => {
  const { currentUser } = useContext(AuthContext);
  let { libraryId } = useParams();
  let [libraryData, setLibraryData] = useState(null);
  const navigate = useNavigate();
  const classes = useStyles();

  useEffect(() => {
    async function getLibraryStories() {
      try {
        const { data } = await axios.get(`/api/libraries/library_stories/${libraryId}?owner=${currentUser.uid}`, {
          headers: { authtoken: await currentUser.getIdToken() },
        });
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
  }, []);

  if (libraryData) {
    return (
      <div>
        <div>
          <Typography className={classes.title} subtitle={""}>

            {libraryData && libraryData.libraryName}

          </Typography>
        </div>
        <br />
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
                                <CardMedia className={classes.images} component="img" image={libraryStory.coverImage} />
                              </Link>
                            </div>
                            <div className={classes.card4}>
                              <Link to={`/stories/${libraryStory._id}`}>
                                <Typography className={classes.content}> {libraryStory.title} </Typography>
                              </Link>

                            </div>
                            <div>
                              <Typography>
                                {" "}
                                {libraryStory.shortDescription.length > 500
                                  ? libraryStory.shortDescription.substring(0, 500) + "..."
                                  : libraryStory.shortDescription}{" "}
                              </Typography>
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
        </Stack>
      </div>
    );
  }
};

export default AllLibraryStories;
