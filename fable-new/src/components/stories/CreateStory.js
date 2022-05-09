import { Grid, OutlinedInput, Paper, Select, Typography } from "@material-ui/core";
import { Button, MenuItem, TextField, FormControl, Alert } from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import React, { useState, useRef, useContext } from "react";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import { AuthContext } from "../../firebase/Auth";
import { makeStyles } from "@material-ui/core";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Stack from "@mui/material/Stack";
import { NavLink } from "react-router-dom";
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
  "Adult",
];
const useStyles = makeStyles({
  card1: {
    width: "30%",
    paddingLeft: "300px",
  },
  button: {
    backgroundColor: "blanchedalmond",
    color: "black",
    border: "4px solid",
  },
  genre: {
    color: "grey",
    justifyContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
  },
  story: {
    color: "grey",
    justifyContent: "center",
    fontSize: "25px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  button1: {
    backgroundColor: "black",
    color: "blanchedalmond",
    width: "10%",
    marginLeft: "auto",
    marginRight: "auto",
    "&:hover": {
      backgroundColor: "blanchedalmond",
      color: "black",
    },
  },

  button2: {
    backgroundColor: "blanchedalmond",
    color: "black",
    width: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    "&:hover": {
      backgroundColor: "black",
      color: "blanchedalmond",
    },
  },

  button3: {
    backgroundColor: "blanchedalmond",
    color: "black",
    marginLeft: "auto",
    marginRight: "auto",
    "&:hover": {
      backgroundColor: "black",
      color: "blanchedalmond",
    },
  },

  headertext: {
    backgroundColor: "black",
    color: "blanchedalmond",
    width: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    paddingRight: "30px",
    paddingLeft: "30px",
    paddingTop: "10px",
    paddingBottom: "10px",
    borderRadius: "10px",
    fontSize: "40px",
    "&:hover": {
      backgroundColor: "blanchedalmond",
      color: "black",
    },
  },
});

const CreateStory = () => {
  const editorRef = useRef(null);
  const { currentUser } = useContext(AuthContext);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [creationSuccess, setCreationSuccess] = useState(false);
  const classes = useStyles();

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
    formData.append("genres", selectedGenres);
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
      <div>
        <Paper elevation={3}>
          <br />

          <Grid container justifyContent="center" alignItems="center">
            <Typography variant="h3" component={"h1"} className={classes.headertext}>
              Create your story here!
            </Typography>
          </Grid>
          <br />
          <br />
          <br />
          <FormControl variant="standard" sx={{ m: 2, minWidth: "98.5%" }}>
            <Typography className={classes.story}>Title *</Typography>
            <br />
            <Input
              sx={{
                width: "30%",
                marginLeft: "auto",
                marginRight: "auto",
                paddingTop: "35px",
                border: "4px black",
              }}
              id="title"
              label="Title of the story"
              variant="filled"
              value={title}
              required
              onChange={(e) => handleChange(e, "title")}
            />

            <br />
            <br />
            <Typography className={classes.story}>A short description of the story *</Typography>
            <br />

            <Input
              sx={{
                width: "30%",
                marginLeft: "auto",
                marginRight: "auto",
                paddingTop: "35px",
              }}
              id="short_desc"
              label="A short description of the story"
              variant="filled"
              multiline
              value={desc}
              minRows={4}
              maxRows={4}
              require
              onChange={(e) => handleChange(e, "desc")}
            />
            <br />
            <br />
            <Typography className={classes.story}>Your Story Goes Here! *</Typography>
            <br />
            <Editor
              className={classes.card1}
              required
              onLoadContent={() => {
                setTimeout(() => {
                  let close = document.getElementsByClassName("tox-notification__dismiss")[0];
                  if (close) close.click();
                }, 20);
              }}
              onInit={(evt, editor) => (editorRef.current = editor)}
            />
            <br />
            <br />
            <Typography className={classes.story}>Select all the Genres that apply! *</Typography>
            <br />
            <Select
              sx={{ width: "30%" }}
              id="genres"
              label="Genres"
              placeholder="Genres"
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

            <Button variant="contained" component="label" className={classes.button2}>
              Upload a cover photo for your story &nbsp;&nbsp;
              <input
                type="file"
                accept="image/jpeg, image/png, .jpeg, .jpg, .png"
                onChange={(e) => handleChange(e, "file")}
              />
            </Button>
            <br />
            <br />
            <Button variant="contained" onClick={createStory} className={classes.button1}>
              Create Story
            </Button>
          </FormControl>
        </Paper>
      </div>
    </div>
  );
};

export default CreateStory;
