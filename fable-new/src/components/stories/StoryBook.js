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
import { Link, useParams } from "react-router-dom";
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

const useStyles = makeStyles({
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
    marginLeft: "40%",
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
  useEffect(() => {
    async function getStoryData() {
      const { data } = await axios.get(`/api/stories/${storyId}`);
      console.log(data);
      if (data.success) {
        setStory(data.story);
      }
    }
    getStoryData();
  }, [storyId]);

  useEffect(() => {
    async function getMyLibraries() {
      const { data } = await axios.get(`/api/libraries/me?owner=${currentUser.uid}&storyId=${storyId}`);
      console.log(data);
      setMyLibraries(data.libraries);
    }
    getMyLibraries();
  }, [added]);

  const handleLike = async () => {
    const { data } = await axios.post(`/api/stories/${storyId}/like`, {
      userId: currentUser.uid,
    });
    setStory(data.story);
  };

  const addToLibrary = async () => {
    async function addToMyLibrary() {
      if (currentUser.uid && selectedLib.length > 0) {
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
        setAdded(added + 1);
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
        <Hero title={story.title} />
        <br />
        <Card>
          <CardMedia className={classes.media} component="img" image={story.coverImage} />
        </Card>
        <span className={classes.fab}>
          {!story.likedBy.includes(currentUser.uid) && (
            <Fab variant="circular" color="default" onClick={handleLike}>
              {/* Liked the story? */}
              <FavoriteIcon />
            </Fab>
          )}
          {story.likedBy.includes(currentUser.uid) && (
            <Fab variant="circular" color="secondary" onClick={handleLike} elevation={11}>
              {/* Did not like the story? Let us know! */}
              <FavoriteIcon />
            </Fab>
          )}
          {"   "}
        </span>
        <Fab variant="extended" color="inherit" onClick={openLibrarySelectModal}>
          <AddIcon />
          Add to my library
        </Fab>
        <Divider />
        <br />
        <div className={classes.storyBook}>
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(story.contentHtml),
            }}
          ></div>
        </div>
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
              You can add this story to one of your libraries and share it with others...
              <br />
              <Typography className={classes.inModalHead} variant="overline">
                Want to create a new library? <Link to={`/libraries/create`}>Click here</Link>
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
                value={
                  selectedLib.length === 0
                    ? myLibraries.length === 0
                      ? "No libraries available."
                      : myLibraries.length > 0 && myLibraries[0]._id
                    : selectedLib
                }
                label={"Libraries"}
                onChange={selectLibrary}
              >
                {myLibraries.length === 0 && <MenuItem disabled>No libraries available.</MenuItem>}
                {myLibraries.length > 0 &&
                  myLibraries.map((lib, idx) => {
                    if (idx === 0)
                      return (
                        <MenuItem key={idx} selected value={lib._id}>
                          {lib.libraryName} ({lib.private ? "Private" : "Public"})
                        </MenuItem>
                      );
                    else
                      return (
                        <MenuItem key={idx} value={lib._id}>
                          {lib.libraryName} ({lib.private ? "Private" : "Public"})
                        </MenuItem>
                      );
                  })}
              </Select>
              <br />
              {myLibraries.length > 0 && (
                <Button className={classes.libSubmitBtn} variant="contained" onClick={addToLibrary}>
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
