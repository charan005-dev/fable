import {
  Avatar,
  Box,
  Button,
  Divider,
  FormControl,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { SidePane } from "react-side-pane";
import { toast } from "react-toastify";
import { AuthContext } from "../../firebase/Auth";

const useStyles = makeStyles({
  commentsPane: {
    paddingTop: 70,
    paddingLeft: 50,
  },
  commentsBox: {
    margin: 10,
    height: "100%",
    paddingTop: "2vw",
  },
  textfield: {
    width: "25vw",
    marginLeft: "13.3%",
  },
  form: {
    width: "38.7vw",
    height: "auto",
  },
  button: {
    borderRadius: "14px",
    marginLeft: "1%",
    marginBottom: "1%",
    marginRight: "1%",
    marginTop: "1%",
    backgroundColor: "#ececec",
    color: "black", 
    border: "1px solid",
    "&:hover": {
      color: "white",
      backgroundColor: "black",
     
    },
  },
  buttonupdate: {
    backgroundColor: "black",
    color: "white",
    width: "auto",
    marginLeft: "35.5%",
    marginRight: "auto",
    "&:hover": {
      backgroundColor: "black",
      color: "white",
    },
  },
  commenttext: {
    fontWeight: "Bold",
    fontSize: "14px",
    fontStyle: "italic",
    fontColor: "grey",
  },
  text: {
    paddingLeft: "12.5vw", 
    background:"#ecece"
  },
  text1: {
    paddingLeft: "8.5vw",
  },
});

const Comments = ({ open, handleClose, storyId }) => {
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState({ error: false, text: "" });
  const [comments, setComments] = useState([]);
  const classes = useStyles();
  let { currentUser } = useContext(AuthContext);

  useEffect(() => {
    async function getExistingComments() {
      const { data } = await axios.get(`/api/stories/${storyId}/comments`, {
        headers: {
          authtoken: await currentUser.getIdToken(),
        },
      });
      console.log(data);
      setComments(data.comments);
    }
    getExistingComments();
  }, [storyId]);

  const handleCommentInput = (e) => {
    let comment = e.target.value;
    if (
      !comment ||
      typeof comment !== "string" ||
      comment.length === 0 ||
      comment.trim().length === 0 ||
      comment.length > 250
    ) {
      setComment(comment);
      setCommentError({
        error: true,
        text: "Your comment text is invalid. Enter less than 250 characters.",
      });
      return;
    }
    setComment(comment);
    setCommentError({ error: false, text: "" });
  };

  const addComment = async () => {
    if (commentError.error) {
      toast.error(
        "Your input is invalid for the comment. Please recheck your inputs and try again.",
        {
          theme: "dark",
        }
      );
      return;
    }
    try {
      const { data } = await axios.post(
        `/api/stories/${storyId}/comment`,
        {
          comment,
        },
        {
          headers: {
            authtoken: await currentUser.getIdToken(),
          },
        }
      );
      console.log(data.story.comments);
      setComments(data.story.comments);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <SidePane
        className={classes.commentsPane}
        open={open}
        width={40}
        height={"100%"}
        onClose={handleClose}
      >
        <Box className={classes.commentsBox}>
          <Typography variant="h4" component={"h2"} className={classes.text}>
            Comments
          </Typography>
         
          <br />
          <div>
            <FormControl className={classes.form}>
              <TextField
                fullWidth
                className={classes.textfield}
                variant="outlined"
                label=" "
                placeholder="Join the discussion!"
                onChange={(e) => handleCommentInput(e)}
                error={commentError.error}
                InputLabelProps={{ shrink: false }}
                helperText={commentError.error && commentError.text}
              />
              <br />
              <Button
                variant="contained"
                onClick={addComment}
                className={classes.buttonupdate}
              >
                Post Comment
              </Button>
            </FormControl>
            <br />
            <br />
            <br />

            {comments && comments.length === 0 && (
              <Typography variant="body2" className={classes.text1}>
                No comments yet. Be the first person to speak out.
              </Typography>
            )}

            {comments &&
              comments.length > 0 &&
              comments.map((comment) => {
                return (
                  <div>
                    <Button className={classes.button}>
                      <Typography className={classes.commenttext}>
                        {comment.commenterName}{" "}
                      </Typography>
                      &nbsp;: {comment.comment}
                    </Button>
                  </div>
                );
              })}
          </div>
          <br />
        </Box>
      </SidePane>
    </div>
  );
};

export default Comments;
