import { Grid, OutlinedInput, Paper, Select, Typography } from "@material-ui/core";
import { Button, MenuItem, TextField, FormControl, Alert } from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import React, { useState, useRef, useContext } from "react";
import { AuthContext } from "../../firebase/Auth";
const axios = require("axios").default;

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
];

const CreateStory = () => {
  const editorRef = useRef(null);
  const { currentUser } = useContext(AuthContext);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [creationSuccess, setCreationSuccess] = useState(false);

  const handleGenreSelect = (e) => {
    const value = e.target.value;
    setSelectedGenres(typeof value === "string" ? value.split(",") : value);
  };

  const handleChange = (e, identifier) => {
    switch (identifier) {
      case "title":
        setTitle(e.target.value.length !== 0 ? e.target.value : "");
        break;
      case "desc":
        setDesc(e.target.value.length !== 0 ? e.target.value : "");
        break;
      case "file":
        setCoverImage(e.target.files[0]);
        break;
      case "default":
        break;
    }
  };

  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  const createStory = async () => {
    let formData = new FormData();
    formData.append("creatorId", currentUser.uid);
    formData.append("title", title);
    formData.append("shortDescription", desc);
    formData.append("contentHtml", editorRef.current ? editorRef.current.getContent() : "");
    formData.append("coverImage", coverImage);
    const { data } = await axios.post("/api/stories", formData, {
      headers: {
        "Content-Type": `multipart/form-data`,
      },
    });
    if (data.success) {
      setTitle("");
      setDesc("");
      setSelectedGenres([]);
      setCreationSuccess(true);
    }
  };

  return (
    <div>
      {creationSuccess && <Alert severity="success">Successfully created the story!</Alert>}
      {!creationSuccess && (
        <div>
          <Paper elevation={3}>
            <br />
            <Grid container justifyContent="center" alignItems="center">
              <Typography variant="h3" component={"h1"}>
                Create your story here!
              </Typography>
            </Grid>
            <br />
            <FormControl variant="standard" sx={{ m: 2, minWidth: "98.5%" }}>
              <TextField
                className="new-story-form-els"
                sx={{ width: "100%" }}
                id="title"
                label="Title of the story"
                variant="filled"
                value={title}
                onChange={(e) => handleChange(e, "title")}
              />
              <br />
              <br />
              <TextField
                className="new-story-form-els"
                sx={{ width: "100%" }}
                id="short_desc"
                label="A short description of the story"
                variant="filled"
                multiline
                value={desc}
                minRows={4}
                maxRows={4}
                onChange={(e) => handleChange(e, "desc")}
              />
              <br />
              <br />
              <Editor
                onLoadContent={() => {
                  setTimeout(() => {
                    let close = document.getElementsByClassName("tox-notification__dismiss")[0];
                    if (close) close.click();
                  }, 20);
                }}
                className="new-story-form-els"
                onInit={(evt, editor) => (editorRef.current = editor)}
              />
              <br />
              <br />
              <Select
                id="genres"
                label="Genres"
                value={selectedGenres}
                multiple
                input={<OutlinedInput label="Genre" />}
                onChange={handleGenreSelect}
              >
                {genres.map((genre) => {
                  return (
                    <MenuItem key={genre} value={genre}>
                      {genre}
                    </MenuItem>
                  );
                })}
              </Select>
              <br />
              <br />
              <Button variant="contained" component="label">
                Upload a cover photo for your story
                <input
                  type="file"
                  accept="image/jpeg, image/png, .jpeg, .jpg, .png"
                  onChange={(e) => handleChange(e, "file")}
                  hidden
                />
              </Button>
              <br />
              <br />
              <Button variant="contained" onClick={createStory}>
                Create Story
              </Button>
            </FormControl>
          </Paper>
        </div>
      )}
    </div>
  );
};

export default CreateStory;
