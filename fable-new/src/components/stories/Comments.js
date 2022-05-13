import { Avatar, Box, Button, Divider, FormControl, TextField, Typography } from "@material-ui/core";
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
  },
  commentsBox: {
    margin: 10,
    height: "inherit",
    border: "solid",
  },
  form: {
    width: "38.7vw",
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
      setCommentError({ error: true, text: "Your comment text is invalid. Enter less than 250 characters." });
      return;
    }
    setComment(comment);
    setCommentError({ error: false, text: "" });
  };

  const addComment = async () => {
    if (commentError.error) {
      toast.error("Your input is invalid for the comment. Please recheck your inputs and try again.", {
        theme: "dark",
      });
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
      <SidePane className={classes.commentsPane} open={open} width={40} onClose={handleClose}>
        <Box className={classes.commentsBox}>
          <Typography variant="h4" component={"h2"}>
            Comments
          </Typography>
          <Divider />
          <br />
          <div>
            {comments && comments.length === 0 && (
              <Typography variant="body2">No comments yet. Be the first person to speak out.</Typography>
            )}
            {comments &&
              comments.length > 0 &&
              comments.map((comment) => {
                return (
                  <span>
                    <Typography variant="body2">
                      {comment.commenterName} says: {comment.comment}
                    </Typography>
                  </span>
                );
              })}
          </div>
          <br />
          <Divider />
          <FormControl className={classes.form}>
            <TextField
              variant="filled"
              label="Comment"
              placeholder="Join the discussion!"
              onChange={(e) => handleCommentInput(e)}
              error={commentError.error}
              helperText={commentError.error && commentError.text}
            />
            <br />
            <Button variant="contained" onClick={addComment}>
              Post Comment
            </Button>
          </FormControl>
        </Box>
      </SidePane>
    </div>
  );
};

export default Comments;
