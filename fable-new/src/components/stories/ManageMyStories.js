import { Card, CardContent, Chip, Grid, Paper, Switch } from "@material-ui/core";
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
          `/api/stories/me?genres=${selectedGenres}&authorId=${currentUser.uid}&exact=false`
        );
        console.log("Data ", data);
        setMyStories(data.stories);
      }
      if (doExactMatch) {
        const { data } = await axios.get(
          `/api/stories/me?genres=${selectedGenres}&authorId=${currentUser.uid}&exact=true`
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
              <Card>
                <CardContent>
                  <Link to={`/stories/${story._id}`}>{story.title}</Link>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
};

export default ManageMyStories;
