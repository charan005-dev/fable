import { Chip, Paper } from "@material-ui/core";
import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../firebase/Auth";

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
];

const ManageMyStories = () => {
  const [myStories, setMyStories] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [selectedGenres, setSelectedGenres] = useState([]);

  useEffect(() => {
    async function getMyStoriesByGenres() {
      if (currentUser.uid) {
        const { data } = await axios.get(`/api/stories/me?genres=${selectedGenres}&authorId=${currentUser.uid}`);
        console.log(data);
      }
    }
    getMyStoriesByGenres();
  }, [selectedGenres]);

  const chipSelect = (genre) => {
    if (!selectedGenres.includes(genre)) {
      let genreCopy = selectedGenres;
      genreCopy.push(genre);
      setSelectedGenres(genreCopy);
    }
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
      <Paper variant="outlined">
        {genres &&
          genres.map((genre) => {
            console.log(selectedGenres, genre);
            if (selectedGenres.includes(genre)) {
              return <Chip label={genre} onDelete={() => chipDeselect(genre)} />;
            }
            return <Chip label={genre} onClick={() => chipSelect(genre)} />;
          })}
      </Paper>
    </div>
  );
};

export default ManageMyStories;
