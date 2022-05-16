import {
  Button,
  Card,
  CardMedia,
  Divider,
  Fab,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Hero from "../Hero";
import DOMPurify from "dompurify";
import { makeStyles } from "@material-ui/styles";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddIcon from "@mui/icons-material/Add";
import { useContext } from "react";
import { AuthContext } from "../../firebase/Auth";
import Modal from "@mui/material/Modal";
import { Box } from "@material-ui/core";
import Backdrop from "@mui/material/Backdrop";
import { Paper, Stack, CardContent, Grid } from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { toast } from "react-toastify";
import noImage from "../Assets/noimage.jpeg";
const useStyles = makeStyles({
  card: {
    maxWidth: "200px",
    maxHeight: "400px",
    marginLeft: "60%",
    marginTop: "1.5%",
  },
  storyBook: {
    margin: 100,
  },
  libSubmitBtn: {
    color: "#000",
  },
  inModalHead: {
    padding: 4,
    backgroundColor: "#e4e4e4",
    color: "#000",
    borderRadius: 4,
  },
  fab: {
    marginLeft: "0%",
  },
  fablib: {
    marginLeft: "5%",
    backgroundColor: "black",
    color: "white",
    "&:hover": {
      backgroundColor: "white",
      color: "black",
      radius: "solid 1px",
    },
  },
  fab1: {
    marginLeft: "1%",
    marginBottom: "2%",
    marginTop: "2%",
    backgroundColor: "black",
    color: "blanchedalmond",
    "&:hover": {
      backgroundColor: "blanchedalmond",
      color: "black",
    },
  },
  card1: {
    width: "70%",
    marginLeft: "16%",
    marginRight: "16%",
    marginTop: "2%",
    paddingLeft: "0%",
    paddingRight: "0%",
    textIndent: "0px",
    fontSize: "25px",
    lineHeight: "35px",
    paddingTop: "1%",
  },
  card2: {
    width: "15%",
    marginBottom: "100px",
  },
  cardnew: {
    marginLeft: "-10%",
    marginRight: "60%",
    paddingBottom: "10%",
    paddingLeft: "5%",
    paddingTop: "8%",
    fontSize: "40px",
    padding: "5%",
    width: "50%",
  },

  media: {
    height: "100%",
    maxWidth: "100%",
  },
  title: {
    border: "0px #fff",
    width: "auto",
    height: "auto",
    marginTop: "1px",
    paddingTop: "5%",
    fontFamily: "'Encode Sans Semi Expanded', sans-serif",
  },
  title1: {
    width: "auto",
    height: "auto",

    fontFamily: "'Encode Sans Semi Expanded', sans-serif",
  },
  background: {
    backgroundColor: "blanchedalmond",
  },
  h1: {
    color: "#ee3413",
  },
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#343a40",
  color: "#f8f9fa",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const StoryBook = () => {
  const [story, setStory] = useState(null);
  let { storyId } = useParams();
  let { currentUser } = useContext(AuthContext);
  const [libSelectModal, setLibSelectModal] = useState(false);
  const [selectedLib, setSelectedLib] = useState("");
  const [myLibraries, setMyLibraries] = useState([]);
  const [added, setAdded] = useState(0);
  const openLibrarySelectModal = () => setLibSelectModal(true);
  const closeLibrarySelectModal = () => setLibSelectModal(false);

  const classes = useStyles();
  const navigate = useNavigate();
  useEffect(() => {
    async function getStoryData() {
      const { data } = await axios.get(`/api/stories/${storyId}`, {
        headers: { authtoken: await currentUser.getIdToken() },
      });
      console.log(data);
      if (data.success) {
        setStory(data.story);
      }
    }
    async function recordUserVisit() {
      const { data } = await axios.get(`/api/stories/${storyId}/hit`, {
        headers: { authtoken: await currentUser.getIdToken() },
      });
      console.log(data);
    }
    getStoryData();
    recordUserVisit();
  }, [storyId]);

  useEffect(() => {
    async function getMyLibraries() {
      const { data } = await axios.get(
        `/api/libraries/me?owner=${currentUser.uid}&storyId=${storyId}`,
        {
          headers: { authtoken: await currentUser.getIdToken() },
        }
      );

      console.log(data);
      setMyLibraries(data.libraries);
      setSelectedLib(data.libraries[0]);
    }
    getMyLibraries();
  }, [added]);

  const handleLike = async () => {
    const { data } = await axios.post(
      `/api/stories/${storyId}/like`,
      {
        userId: currentUser.uid,
      },
      { headers: { authtoken: await currentUser.getIdToken() } }
    );
    setStory(data.story);
    if (data.story.likedBy.includes(currentUser.uid))
      toast.dark("Thanks for your like!");
  };

  const addToLibrary = async () => {
    async function addToMyLibrary() {
      if (currentUser.uid && selectedLib.length > 0) {
        try {
          const { data } = await axios.post(
            `/api/libraries/add`,
            {
              owner: currentUser.uid,
              libraryId: selectedLib,
              storyId: storyId,
            },
            { headers: { authtoken: await currentUser.getIdToken() } }
          );
          console.log(data);
          setLibSelectModal(false);
          toast.dark(
            "Successfully added to library " + data.library.library.libraryName
          );
          setAdded(added + 1);
        } catch (e) {
          console.log(e);
          if (e.response && e.response.data && e.response.data.error) {
            toast.error(e.response.data.error, {
              theme: "dark",
              autoClose: 2000,
            });
            return;
          }
          toast.error("Cannot perform the action. Please try again.", {
            theme: "dark",
          });
          return;
        }
      }
    }
    addToMyLibrary();
  };

  const selectLibrary = async (e) => {
    setSelectedLib(e.target.value);
  };

  if (story) {
    return (
      <div>
        <br />
        <Paper
          elevation={10}
          sx={{
            bgcolor: "background.default",
            display: "grid",
            gridTemplateColumns: { md: "1fr 1fr" },
            gap: 2,
            paddingBottom: "2%",
            paddingTop: "1%",
          }}
        >
          <Grid container justifyContent="center" direction="row">
            <Card className={classes.card} elevation={15}>
              <CardMedia
                className={classes.media}
                component="img"

                alt="img"
                image={
                  story.coverImage ? story.coverImage : "/images/noimage.jpeg"
                }

              />
            </Card>
          </Grid>
          <Grid container justifyContent="center" direction="row">
            <Card className={classes.cardnew} elevation={0}>
              <Typography variant={"h3"} component={"h1"}>
                {story.title}
              </Typography>
              <span className={classes.fab}>
                <label hidden for="like">
                  like
                </label>
                {!story.likedBy.includes(currentUser.uid) && (
                  <Fab
                    variant="circular"
                    color="default"
                    onClick={handleLike}
                    id="like"
                  >
                    {/* Liked the story? */}
                    <FavoriteIcon />
                  </Fab>
                )}
                {story.likedBy.includes(currentUser.uid) && (
                  <Fab
                    variant="circular"
                    color="secondary"
                    onClick={handleLike}
                    elevation={11}
                    id="like"
                  >
                    {/* Did not like the story? Let us know! */}
                    <FavoriteIcon />
                  </Fab>
                )}
                {"   "}
                &nbsp;
              </span>
              <Fab
                className={classes.fablib}
                variant="extended"
                color="inherit"
                onClick={openLibrarySelectModal}
              >
                <AddIcon />
                Add to my library
              </Fab>
            </Card>
          </Grid>
        </Paper>
        <br />
        {/* ///////////////////  */}
        {/* story component */}
        <Card elevation={10} className={classes.card1}>
          <div className={classes.storyBook + " story_content"}>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(story.contentHtml),
              }}
            ></div>
          </div>
        </Card>
        {/* story component */}
        <Modal
          open={libSelectModal}
          onClose={closeLibrarySelectModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Select a library
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              You can add this story to one of your libraries and share it with
              others...
              <br />
              <Typography className={classes.inModalHead} variant="overline">
                Want to create a new library?{" "}
                <Link to={`/libraries/create`}>Click here</Link> 
           
              </Typography>
            </Typography>
            <br />
            <FormControl fullWidth>
              <InputLabel style={{ color: "#fff" }} id="lib-select-label">
                Libraries
              </InputLabel>
              <Select
                style={{ color: "#fff" }}
                labelId="lib-select-label"
                id="lib-select"
                value={selectedLib}
                label={"Libraries"}
                onChange={selectLibrary}
              >
                {myLibraries.length === 0 && (
                  <MenuItem disabled>No libraries available.</MenuItem>
                )}
                {myLibraries.length > 0 &&
                  myLibraries.map((lib, idx) => {
                    if (idx === 0)
                      return (
                        <MenuItem key={idx} selected value={lib._id}>
                          {lib.libraryName} (
                          {lib.private ? "Private" : "Public"})
                        </MenuItem>
                      );
                    else
                      return (
                        <MenuItem key={idx} value={lib._id}>
                          {lib.libraryName} (
                          {lib.private ? "Private" : "Public"})
                        </MenuItem>
                      );
                  })}
              </Select>
              <br />

              {myLibraries.length > 0 && (
                <Button
                  className={classes.libSubmitBtn}
                  variant="contained"
                  onClick={addToLibrary}
                >
                  Add To Library
                </Button>
              )}
            </FormControl>
          </Box>
        </Modal>
      </div>
    );
  }
};

export default StoryBook;
