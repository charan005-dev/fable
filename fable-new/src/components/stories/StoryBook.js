import { Divider, Fab, Typography } from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Hero from "../Hero";
import DOMPurify from "dompurify";
import { makeStyles } from "@material-ui/styles";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useContext } from "react";
import { AuthContext } from "../../firebase/Auth";

const useStyles = makeStyles({
  storyBook: {
    margin: 100,
  },
});

const StoryBook = () => {
  const [story, setStory] = useState(null);
  let { storyId } = useParams();
  let { currentUser } = useContext(AuthContext);
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

  const handleLike = async () => {
    const { data } = await axios.post(`/api/stories/${storyId}/like`, {
      userId: currentUser.uid,
    });
    setStory(data.story);
  };

  if (story) {
    return (
      <div>
        <Hero title={story.title} />
        <br />
        {!story.likedBy.includes(currentUser.uid) && (
          <Fab variant="primary" onClick={handleLike}>
            {/* Liked the story? */}
            <FavoriteIcon />
          </Fab>
        )}
        {story.likedBy.includes(currentUser.uid) && (
          <Fab variant="secondary" onClick={handleLike}>
            {/* Did not like the story? Let us know! */}
            <FavoriteIcon />
          </Fab>
        )}
        <Divider />
        <br />
        <div className={classes.storyBook}>
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(story.contentHtml) }}></div>
        </div>
      </div>
    );
  }
};

export default StoryBook;
