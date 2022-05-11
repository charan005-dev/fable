import { Card, CardContent, Chip, Grid, Paper, Switch, Typography, CardMedia, Box } from "@material-ui/core";
import { Stack } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../firebase/Auth";
import { makeStyles } from "@material-ui/styles";

const genres = [
  "Horror",
  "Romance",
  "Mystery",
  "Thriller",
  "Sci-fi",
  "Crime",
  "Drama",
  "Fantasy",
  "Adventure",
  "Comedy",
  "Tragedy",
  "Adult",
  "Techno",
  "Steamy",
  "Non-fiction",
  "Medieval",
];

const useStyles = makeStyles({
  refinery: {
    padding: 10,
    maxWidth: "70%",
  },
  chip: {
    margin: 4,
  },
  card: {
    padding: 3,
    maxWidth: "16%",
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
    width: "auto",
    paddingRight: "100%",
  },
  stack: {
    width: "auto",
    height: "auto",
    paddingRight: "auto",
  },
  media: {
    width: "50%",
    height: "120px",
    height: "auto",
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
    fontSize: "30px",
    paddingLeft: "43.5%",
  },
  card1: {
    width: "100%",
    height: "8%",
    marginLeft: "10%",
    paddingLeft: "0%",
    paddingRight: "0%",
    marginRight: "2%",
    paddingBottom: "0%",
    marginBottom: "1%",
    fontSize: "25px",
  },
  card2: {
    width: "100%",
    marginBottom: "100px",
    paddingBottom: "2%",
    height: "2%",
  },
  media: {
    height: "300px",
    width: "200px",
  },
  paper: {},
});

const ManageMyStories = () => {
  const [myStories, setMyStories] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [doExactMatch, setDoExactMatch] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    setMyStories([]);
    setSelectedGenres([]);
  }, [doExactMatch]);

  useEffect(() => {
    console.log("useEffect again");
    async function getMyStoriesByGenres() {
      if (!doExactMatch) {
        const { data } = await axios.get(
          `/api/stories/me?genres=${selectedGenres}&authorId=${currentUser.uid}&exact=false`,
          { headers: { authtoken: await currentUser.getIdToken() } }
        );
        console.log("Data ", data);
        setMyStories(data.stories);
      }
      if (doExactMatch) {
        const { data } = await axios.get(
          `/api/stories/me?genres=${selectedGenres}&authorId=${currentUser.uid}&exact=true`,
          { headers: { authtoken: await currentUser.getIdToken() } }
        );
        console.log("Data ", data);
        setMyStories(data.stories);
      }
    }
    getMyStoriesByGenres();
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
    console.log(selectedGenres);
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
          <Card className={classes.card}>
            Filter individually
            <Switch onChange={() => setDoExactMatch(!doExactMatch)} />
          </Card>
        </Paper>
      </Grid>
      <div>
        <br />
        <br />
        <br />
        <br />
        {myStories.length > 0 &&
          myStories.map((story) => {
            return (
              <div>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    "& > :not(style)": {
                      m: 1,
                      width: "auto",
                      height: "auto",
                      marginLeft: 500,
                    },
                  }}
                >
                  <Paper
                    elevation={5}
                    className={classes.paper}
                    sx={{
                      bgcolor: "background.default",
                      display: "grid",
                      gridTemplateColumns: { md: "1fr 1fr" },
                      gap: 2,
                    }}
                  >
                    <Grid>
                      <Stack direction="row">
                        <Card className={classes.card1} elevation={0}>
                          <Link to={`/stories/${story._id}`}>
                            <CardMedia className={classes.media} component="img" image={story.coverImage} />
                          </Link>
                        </Card>

                        <Card className={classes.card2} elevation={0}>
                          <CardContent>
                            <Link to={`/stories/${story._id}`}>
                              <Typography>{story.title}</Typography>
                            </Link>
                          </CardContent>
                          <CardContent>
                            <Typography>
                              {story.shortDescription.length > 200
                                ? story.shortDescription.substring(0, 197) + "..."
                                : story.shortDescription}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Stack>
                    </Grid>
                  </Paper>
                </Box>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ManageMyStories;
