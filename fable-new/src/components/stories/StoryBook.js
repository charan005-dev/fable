import { Divider, Typography } from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Hero from "../Hero";
import DOMPurify from "dompurify";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  storyBook: {
    margin: 100,
  },
});

const StoryBook = () => {
  const [story, setStory] = useState(null);
  let { storyId } = useParams();
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
  if (story) {
    return (
      <div>
        <Hero title={story.title} />
        <br />
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
