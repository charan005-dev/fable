import { Card, CardContent, Chip, Grid, Paper, Switch, Typography, CardMedia, Box } from "@material-ui/core";
import { Divider, Stack } from "@mui/material";
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../firebase/Auth";
import { makeStyles } from "@material-ui/styles";
import noImage from "../Assets/noimage.jpeg";
const { genres } = require("../genres");
// const genres = [
//   "Horror",
//   "Romance",
//   "Mystery",
//   "Thriller",
//   "Sci-fi",
//   "Crime",
//   "Drama",
//   "Fantasy",
//   "Adventure",
//   "Comedy",
//   "Tragedy",
//   "Adult",
//   "Techno",
//   "Steamy",
//   "Non-fiction",
//   "Medieval",
// ];

const useStyles = makeStyles({
  refinery: {
    padding: 10,
    maxWidth: "70%",
  },
  chip: {
    margin: 4,
  },
  card: {
    margin: 6,
    float: "left",
    backgroundColor: "#2F2F2F",
    color: "#fff",
    paddingLeft: 30,
    padding: 10,
    maxWidth: 300,
  },
  storyLink: {
    textDecoration: "none",
  },
  imageWrapper: {},
  images: {
    margin: 15,
    border: "solid 1px black",
    borderRadius: "50%",
    boxShadow: "2px 2px 2px 2px",
    width: 150,
    height: 150,
  },
  title: {
    border: " 0px #fff",
    paddingRight: "100%",
  },
  media: {
    width: "50%",
    height: "120px",
    float: "left",
    margin: "3px",
    padding: "3px",
  },
  cards: {
    width: "500px",
    height: "600px",
    marginLeft: "100%",
    marginRight: "100%",
    border: "3px solid black",
    borderRadius: "5px",
  },
  text: {
    color: "grey",
    justifyContent: "center",
    marginLeft: "11.5%",
  },
  box: {
    marginLeft: "44%",
    marginRight: "100%",
  },
  title: {
    color: "black",
    justifyContent: "center",
    fontSize: "30px",
    paddingLeft: "43.5%",
  },
  card1: {
    width: "20%",
    height: "40%",
    marginLeft: "5%",
    paddingLeft: "0%",
    paddingRight: "10%",
    marginRight: "5%",
  },
  card2: {
    width: "100%",
    marginTop: "5%",
    marginRight: "10%",
    marginBottom: "5%",
    paddingBottom: "2%",
    height: "15vw",
  },
  images1: {
    // display: "inline-block",
    // verticalAlign: "top",
    margin: "30%",
    border: "solid 1px black",
    borderRadius: "5px",
    //boxShadow: "0px 5px 10px",
    // float: "left",
    width: "10vw",
    height: "15vw",
    marginTop: "50%",
    marginBottom: "40%",
    marginLeft: "10%",
  },
  media: {
    marginTop: "10%",
    marginBottom: "10%",
    height: "15vw",
    width: "10vw",
  },
  paper: {
    width: "65vw",
    height: "20vw",
    marginTop: "-3%",
    marginRight: "15%",
    marginBottom: "5%",
    marginLeft: "25%"
  }
});

const ManageMyStories = () => {
  const [myStories, setMyStories] = useState([]);
  const { currentUser } = useContext(AuthContext);
  let { genre } = useParams();
  if (!genres.includes(genre)) genre = "";
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [doExactMatch, setDoExactMatch] = useState(false);
  const classes = useStyles();
  const navigate = useNavigate();

  //   useEffect(() => {
  //     let genreCopy = [];
  //     for (const sg of selectedGenres) {
  //       genreCopy.push(sg);
  //     }
  //     genreCopy.push(genre);
  //     setSelectedGenres(genreCopy);
  //   }, []);

  useEffect(() => {
    setMyStories([]);
    setSelectedGenres([genre]);
  }, [doExactMatch]);

  useEffect(() => {
    async function getmyStoriesByGenres() {
      if (!doExactMatch) {
        const { data } = await axios.get(`/api/stories/filter?genres=${selectedGenres}&exact=false`, {
          headers: { authToken: await currentUser.getIdToken() },
        });
        console.log(data);
        setMyStories(data.stories);
      }
      if (doExactMatch) {
        const { data } = await axios.get(`/api/stories/filter?genres=${selectedGenres}&exact=true`, {
          headers: { authToken: await currentUser.getIdToken() },
        });
        console.log(data);
        setMyStories(data.stories);
      }
    }
    getmyStoriesByGenres();
  }, [selectedGenres]);

  const chipSelect = (genre) => {
    if (!selectedGenres.includes(genre)) {
      let genreCopy = [];
      for (const sg of selectedGenres) {
        genreCopy.push(sg);
      }
      genreCopy.push(genre);
      setSelectedGenres(genreCopy);
    }
    console.log("selected", selectedGenres);
  };

  const chipDeselect = (genre) => {
    if (selectedGenres.includes(genre)) {
      let genreCopy = selectedGenres;
      let newCopy = [];
      genreCopy.forEach((g) => {
        if (g !== genre) newCopy.push(g);
      });
      setSelectedGenres(newCopy);
    }
    console.log(selectedGenres);
  };

  return (
    <div>
      <br />
      <br />
      <br />
      <br />
      <Grid container justifyContent="center">
        <Paper variant="outlined" className={classes.refinery}>
          <Typography variant="h3" component="h1">
            Filter Stories
          </Typography>
          <br />
          {genres &&
            genres.map((genre, idx) => {
              //console.log(selectedGenres, genre);
              if (selectedGenres.includes(genre)) {
                return <Chip className={classes.chip} key={genre} label={genre} onDelete={() => chipDeselect(genre)} />;
              } else {
                return <Chip className={classes.chip} key={genre} label={genre} onClick={() => chipSelect(genre)} />;
              }
            })}
          <br />
          <br />
          <label hidden for="switch" >Filter </label>
          <Card className={classes.card}>
            Filter individually
            <Switch id="switch" onChange={() => setDoExactMatch(!doExactMatch)} />
          </Card>
        </Paper>
      </Grid>
        <br />
        <br />
        <br />
        <br />
        <div>
          <Box
            // sx={{
            //   flexGrow: 1,
            //   display: "flex",
            //   flexWrap: "wrap",
            //   "& > :not(style)": {
            //     m: 1,
            //     width: 1500,
            //     marginLeft: 320,
            //   },
            // }}
          >
            <Grid container>
              {myStories.length > 0 &&
                myStories.map((story) => {
                  return (
                    <Grid>
                      <Paper
                        elevation={10}
                        className={classes.paper}
                        // sx={{
                        //   bgcolor: "background.default",
                        //   display: "grid",
                        //   gridTemplateColumns: { md: "1fr 1fr" },
                        //   gap: 2,
                        // }}
                      >
                        <Stack direction="row">
                          <Card className={classes.card1} elevation={0}>
                            <Link to={`/stories/${story._id}`}>
                              <CardMedia
                                className={classes.images1}
                                component="img"
                                image={story.coverImage ? story.coverImage : "/images/noimage.jpeg"}
                                alt="coverimage"
                              />
                            </Link>
                          </Card>

                          <Card className={classes.card2} elevation={0}>
                            <CardContent>
                              <Link to={`/stories/${story._id}`} class="text-decoration-none">
                                <Typography>{story.title}</Typography>
                              </Link>
                            </CardContent>

                            <CardContent>
                              <Typography>
                                {story.shortDescription.length > 200
                                  ? story.shortDescription.substring(0, 197) + "..."
                                  : story.shortDescription}
                              </Typography>
                              <Stack direction="row" spacing={1}>
                                {story &&
                                  story.genres &&
                                  story.genres.map((genre, idx) => {
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
                            </CardContent>
                          </Card>
                        </Stack>
                      </Paper>
                    </Grid>
                  );
                })}
            </Grid>
          </Box>
        </div>
    </div>
  );
};

export default ManageMyStories;
