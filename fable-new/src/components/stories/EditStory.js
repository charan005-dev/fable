import React from "react";
import { useContext, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import Input from "@mui/material/Input";
import { Editor } from "@tinymce/tinymce-react";
import { AuthContext } from "../../firebase/Auth";
import { Grid, OutlinedInput, Paper, Select, Typography } from "@material-ui/core";
import { Button, MenuItem, TextField, FormControl, Alert, CircularProgress, AlertTitle } from "@mui/material";
import { makeStyles } from "@material-ui/styles";
import axios from "axios";

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
  container: {
    position: "relative",
    zIndex: 1,
  },
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

const EditStory = () => {
  const editorRef = useRef(null);
  const [storyDetails, setStoryDetails] = useState(null);
  const { storyId } = useParams();
  let { currentUser } = useContext(AuthContext);
  const classes = useStyles();
  const [changingState, setChangingState] = useState({
    title: "",
    desc: "",
    genres: [],
    content: "",
    coverImage: "",
  });

  let existingContent;
  //   const [title, setTitle] = useState("");
  //   const [selectedGenres, setSelectedGenres] = useState("");
  //   const [shortDescription, setShortDescription] = useState("");
  //   const [coverImage, setCoverImage] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e, identifier) => {
    switch (identifier) {
      case "title":
        setChangingState({ ...changingState, title: e.target.value.length !== 0 ? e.target.value : "" });
        break;
      case "desc":
        setChangingState({ ...changingState, desc: e.target.value.length !== 0 ? e.target.value : "" });
        break;
      case "file":
        setChangingState({ ...changingState, coverImage: e.target.value.length !== 0 ? e.target.value : "" });
        break;
      case "default":
        break;
    }
  };

  useEffect(() => {
    async function getStoryDetails() {
      const { data } = await axios.get(`/api/stories/${storyId}`, {
        headers: { authtoken: await currentUser.getIdToken() },
      });
      console.log(data);
      if (data.story.creatorId !== currentUser.uid) {
        setError("You don't have access to perform this action!");
        return;
      }
      setStoryDetails(data.story);
      let newState = {
        title: data.story.title,
        desc: data.story.shortDescription,
        genres: data.story.genres,
        content: data.story.contentHtml,
        coverImage: data.story.coverImage,
      };
      setChangingState(newState);
    }
    getStoryDetails();
  }, [storyId]);

  const handleGenreSelect = (e) => {
    const value = e.target.value;
    setChangingState({ ...changingState, genres: typeof value === "string" ? value.split(",") : value });
  };

  const updateStory = async () => {
    let formData = new FormData();
    formData.append("creatorId", currentUser.uid);
    formData.append("title", changingState.title);
    formData.append("shortDescription", changingState.desc);
    formData.append("genres", changingState.genres);
    formData.append("contentHtml", editorRef.current ? editorRef.current.getContent() : "");
    formData.append("coverImage", changingState.coverImage);
    try {
      const { data } = await axios.put(`/api/stories/${storyId}`, formData, {
        headers: {
          "Content-Type": `multipart/form-data`,
          authtoken: await currentUser.getIdToken(),
        },
      });
      if (data.success) {
        setUpdateSuccess(true);
        return;
      }
    } catch (e) {
      console.log(e);
      setError(e.message);
    }
  };

  //   if (error) {
  //     return <NotificationContainer title={"Permission Error"} severity={"error"} message={error} />;
  //   }

  if (!storyDetails) {
    return <CircularProgress />;
  }

  return (
    <div>
      {/* {updateSuccess && <Alert severity="success">Successfully updated the story!</Alert>} */}
      <div>
        <Paper className={classes.container} elevation={3}>
          {/* {updateSuccess && <NotificationContainer severity={"success"} message={"Successfully updated the story!"} />} */}
          {updateSuccess && (
            <Alert severity="success" color="success">
              <AlertTitle>Success</AlertTitle>
              Successfully updated the story!
            </Alert>
          )}
          <br />
          <Grid container justifyContent="center" alignItems="center">
            <Typography variant="h3" component={"h1"} className={classes.headertext}>
              Use this place to edit and fine-tune your story!
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
              value={changingState.title}
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
              value={changingState.desc}
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
              initialValue={changingState.content}
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
              value={changingState.genres ? changingState.genres : []}
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
              Upload a cover photo for your story
              <input
                type="file"
                accept="image/jpeg, image/png, .jpeg, .jpg, .png"
                onChange={(e) => handleChange(e, "file")}
              />
            </Button>
            <br />
            <br />
            <Button variant="contained" onClick={updateStory} className={classes.button1}>
              Update Story
            </Button>
          </FormControl>
        </Paper>
      </div>
    </div>
  );
};

export default EditStory;
