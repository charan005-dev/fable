import { Grid, OutlinedInput, Paper, Select, Typography, MenuItem, CircularProgress } from "@material-ui/core";
import { Button, TextField, FormControl, Alert, Stack, Backdrop } from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useRef, useContext } from "react";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import { AuthContext } from "../../firebase/Auth";
import { makeStyles } from "@material-ui/core";
import { useEffect } from "react";
import { NotificationManager } from "react-notifications";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../Assets/5.gif";
import noImage from "../Assets/noimage.jpeg";
const { genres } = require("../genres");
const axios = require("axios").default;

console.log(genres);
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
// ];

const useStyles = makeStyles({
  card1: {
    width: "100%",
    paddingLeft: "0px",
  },
  button: {
    backgroundColor: "black",
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
    color: "white",
    width: "auto",
    marginLeft: "13%",
    marginRight: "auto",
    border: "0px solid",
    "&:hover": {
      backgroundColor: "black",
      color: "white",
      fontWeight: "bolder",
    },
  },
  buttonback: {
    backgroundColor: "#ececec",
    color: "black",
    width: "auto",
    marginLeft: "1%",
    marginRight: "auto",
    "&:hover": {
      backgroundColor: "black",
      color: "white",
    },
  },

  button2: {
    backgroundColor: "black",
    color: "white",
    width: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    "&:hover": {
      backgroundColor: "black",
      color: "white",
      fontWeight: "bold",
    },
  },

  button3: {
    backgroundColor: "black",
    color: "black",
    marginLeft: "auto",
    marginRight: "auto",
    "&:hover": {
      backgroundColor: "black",
      color: "black",
    },
  },
  logo: {
    marginLeft: "30%",
    marginTop: "8%",
    border: "20px",
  },

  headertext: {
    backgroundColor: "#ececec",
    color: "black",
    width: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    paddingRight: "30px",
    paddingLeft: "30px",
    paddingTop: "10px",
    paddingBottom: "10px",
    borderRadius: "10px",
    fontSize: "40px",
  },
  paper: {
    width: "45%",
    marginLeft: "10%",
    paddingRight: "0.7%",
    maxWidth: 1500,
    height: "auto",
  },
  paperright: {
    width: "20%",
    marginLeft: "14%",
    height: "10%",
    maxHeight: "20%",
  },
  textfield1: {
    width: "127vw",
    marginLeft: "-33%",
  },
  textfield: {
    width: "38vw",
    marginLeft: "2.3%",
  },
  title: {
    marginLeft: "2.1%",
    fontSize: "25px",
  },
  story: {
    marginLeft: "34%",
    fontSize: "25px",
  },
  edit: {
    width: "100vw",
    marginLeft: "-80%",
  },
  imagePreview: {
    backgroundColor: "#808080",
    width: "19.8vw",
  },
});

const CreateStory = () => {
  const editorRef = useRef(null);
  const { currentUser } = useContext(AuthContext);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [title, setTitle] = useState("");
  const navigate = useNavigate();
  const [desc, setDesc] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [creationStarted, setCreationStarted] = useState(false);
  const classes = useStyles();

  const [errors, setErrors] = useState({
    title: { error: false, text: "" },
    desc: { error: false, text: "" },
    content: { error: false, text: "" },
    genres: { error: false, text: "" },
  });

  const handleGenreSelect = (e) => {
    const value = e.target.value;
    setSelectedGenres(typeof value === "string" ? value.split(",") : value);
  };

  const handleChange = (e, identifier) => {
    switch (identifier) {
      case "title":
        let titleValue = e.target.value;
        if (
          !titleValue ||
          typeof titleValue === "string" ||
          titleValue.length === 0 ||
          titleValue.trim().length !== 0
        ) {
          setErrors({
            ...errors,
            title: {
              error: true,
              text: "Your title is invalid. Please enter a valid title (between 6 to 20 characters).",
            },
          });
        }
        setTitle(e.target.value.length !== 0 ? e.target.value : "");
        break;
      case "desc":
        setDesc(e.target.value.length !== 0 ? e.target.value : "");
        break;
      case "file":
        setCoverImage(e.target.files[0] ? e.target.files[0] : noImage);
        let imageAsBlob = URL.createObjectURL(e.target.files[0]);
        setUploadedImageUrl(imageAsBlob);
        break;
      case "default":
        break;
    }
  };

  const isStateValid = () => {
    // checking all the state values to see if they're correct
    // before allowing story creation
    if (
      !title ||
      typeof title !== "string" ||
      title.length === 0 ||
      title.trim().length === 0 ||
      title.length < 6 ||
      title.length > 30
    )
      return {
        e: true,
        message: "Your title value is invalid or contains more/less than the expected amount of characters.",
      };
    if (
      !desc ||
      typeof desc !== "string" ||
      desc.length === 0 ||
      desc.trim().length === 0 ||
      desc.length < 100 ||
      desc.length > 5000
    )
      return {
        e: true,
        message: "Your description is invalid or contains more/less than the expected amount of characters.",
      };
    let content = editorRef.current.getContent();
    if (
      !content ||
      typeof content !== "string" ||
      content.length === 0 ||
      content.trim().length === 0 ||
      content.length < 200 ||
      content.length > 1000000
    )
      return {
        e: true,
        message: "Your story content is invalid or contains more/less than the expected amount of characters.",
      };
    if (
      !Array.isArray(selectedGenres) ||
      selectedGenres.length === 0 ||
      selectedGenres.some((genre) => !genres.includes(genre))
    ) {
      return {
        e: true,
        message:
          "The selected genres are invalid. " +
          (selectedGenres.length === 0 ? "Please select at least one genre for your story" : ""),
      };
    }
    return { e: false };
  };

  const createStory = async () => {
    let validity = isStateValid();
    if (validity.e) {
      toast.error(validity.message, {
        theme: "dark",
      });
      return;
    }
    let formData = new FormData();
    formData.append("creatorId", currentUser.uid);
    formData.append("title", title);
    formData.append("shortDescription", desc);
    formData.append("genres", selectedGenres);
    formData.append("contentHtml", editorRef.current ? editorRef.current.getContent() : "");
    formData.append("coverImage", coverImage);
    setCreationStarted(true);
    try {
      const { data } = await axios.post("/api/stories", formData, {
        headers: {
          "Content-Type": `multipart/form-data`,
          authtoken: await currentUser.getIdToken(),
        },
      });
      console.log(data);
      if (data.success) {
        setTitle("");
        setDesc("");
        setSelectedGenres([]);
        editorRef.current.setContent("");
        toast.success("Your story has been created successfully!", {
          theme: "dark",
        });
        setCreationStarted(false);
        navigate(`/stories/${data.story._id}`);
      }
    } catch (e) {
      setCreationStarted(false);
      if (e.response) console.log(e.response);
      toast.error(e.message, {
        theme: "dark",
      });
    }
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  if (creationStarted) {
    return <img src={logo} alt="loading..." className={classes.logo} />;
  }

  return (
    <div>
      <div>
        <br />
        <ToastContainer />
        <Stack direction="row" spacing={2}>
          <Paper className={classes.paperright} elevation={24}>
            <Button variant="contained" component="label" className={classes.button2}>
              Upload a cover photo for your story
              <input
                type="file"
                accept="image/jpeg, image/png, .jpeg, .jpg, .png"
                onChange={(e) => handleChange(e, "file")}
              />
            </Button>
            {uploadedImageUrl && (
              <Paper elevation={1}>
                <Grid container justifyContent="center">
                  <Typography variant="overline">Preview</Typography>
                  <img className={classes.imagePreview} src={uploadedImageUrl} alt="preview of uploaded" />
                </Grid>
              </Paper>
            )}
          </Paper>

          <Paper className={classes.paper} elevation={20}>
            <br />

            <Grid container justifyContent="center" alignItems="center" elevation={25}>
              <Typography variant="h3" component={"h1"} className={classes.headertext}>
                Create your story here!
              </Typography>
            </Grid>
            <br />
            <br />
            <br />
            <FormControl variant="standard" sx={{ m: 2, minWidth: "98.5%" }}>
              <Typography variant={"h4"} component={"h2"} className={classes.title}>
                Title <Typography variant="overline">(6 - 30 characters)</Typography>
              </Typography>
              <br />

              <TextField
                required
                sx={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  border: "4px black",
                }}
                className={classes.textfield1}
                id="title"
                value={title}
                variant="outlined"
                label=" "
                placeholder="untitled story"
                InputLabelProps={{ shrink: false }}
                onChange={(e) => handleChange(e, "title")}
              />
              <br />
              <br />

              <Typography variant={"h4"} className={classes.title}>
                Short Description of the Story <Typography variant="overline">(30 - 5000 characters)</Typography>
              </Typography>
              <br />

              <TextField
                sx={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  border: "4px black",
                }}
                className={classes.textfield}
                id="short_desc"
                value={desc}
                variant="outlined"
                label=" "
                fullWidth
                placeholder="description"
                InputLabelProps={{ shrink: false }}
                minRows={4}
                maxRows={4}
                multiline
                onChange={(e) => handleChange(e, "desc")}
              />

              <br />
              <br />
              <Typography variant={"h4"} className={classes.title}>
                Your Story Goes Here! <Typography variant="overline">(200 - 1M characters)</Typography>
              </Typography>
              <br />
              <Editor
                required
                onLoadContent={() => {
                  setTimeout(() => {
                    let close = document.getElementsByClassName("tox-notification__dismiss")[0];
                    if (close) close.click();
                  }, 20);
                }}
                initialValue={""}
                onInit={(evt, editor) => (editorRef.current = editor)}
                init={{ max_width: 835, width: "38.5vw" }}
              />
              <br />
              <br />
              <Typography variant={"h4"} className={classes.title}>
                Select All Genres that Apply! <Typography variant="overline">(At least 1)</Typography>
              </Typography>
              <br />

              <Select
                multiple
                displayEmpty
                value={selectedGenres}
                label=" "
                InputLabelProps={{ shrink: false }}
                onChange={handleGenreSelect}
                input={<OutlinedInput />}
                className={classes.textfield}
                renderValue={(selected) => {
                  return selected.join(", ");
                }}
                MenuProps={MenuProps}
                inputProps={{ "aria-label": "Without label" }}
              >
                <MenuItem disabled value="">
                  <em>Select All that Apply!</em>
                </MenuItem>
                {genres.map((genre, idx) => (
                  <MenuItem key={idx} value={genre}>
                    {genre}
                  </MenuItem>
                ))}
              </Select>
              <br />
              <br />
              <span>
                <Button onClick={createStory} className={classes.button1}>
                  Create Story
                </Button>
                <Button onClick={() => window.history.back()} className={classes.buttonback}>
                  back
                </Button>
              </span>
              <br />
            </FormControl>
          </Paper>
        </Stack>
        <br />
        <br />
      </div>
    </div>
  );
};

export default CreateStory;
