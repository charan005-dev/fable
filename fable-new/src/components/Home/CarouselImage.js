import { Carousel } from "react-carousel-minimal";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../firebase/Auth";
import { Link } from "react-router-dom";
import { jsx } from "@emotion/react";
import Slider from "react-slick";
import { Chip, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  dots: {
    marginLeft: "auto",
    marginRight: "auto",
  },
  // username:{
  //   marginLeft:"100",
  //   paddingLeft:100,
  //   marginRight:100

  // }
});

function CarouselImage() {
  const { currentUser } = useContext(AuthContext);
  const [storyData, setStoryData] = useState([]);
  const [storyIds, setStoryIds] = useState([]);
  const navigate = useNavigate();
  const classes = useStyles();

  useEffect(() => {
    async function getAllStories() {
      
      
      const { data } = await axios.get(`/api/stories/random?required=6`, {
        headers: { authtoken: await currentUser.getIdToken() },
      });
      console.log(data);
      let dataForCarousel = [];
      let ids = [];
      for (const story of data.randomStories) {
        dataForCarousel.push({
          image: story.coverImage ? story.coverImage : "/fablefinal.png",
          caption: `<a onclick={function(e) { e.preventDefault(); }} class="carousel-link" href='/stories/${story._id}'>${story.title}</a>`,
        });
        ids.push(story._id);
      }
      setStoryData(dataForCarousel);
    }
    getAllStories();
  }, [currentUser.uid]);

  const captionStyle = {
    fontSize: "2em",
    fontWeight: "bold",
  };
  const slideNumberStyle = {
    fontSize: "20px",
    fontWeight: "bold",
  };

  if (storyData)
    return (
      <div className="App">
        <div style={{ textAlign: "center", backgroundColor:"white" }}>
          <div
            style={{
              padding: " 1px",
              marginbottom:"0%",
              marginLeft:"0%"
            
            
            }}
          >
            {storyData.length >= 6 && <Carousel
              data={storyData}
              time={1000}
              interval={1000}
              width="850px"
              height="300px"
              captionStyle={captionStyle}
              radius="15px"
              slideNumber={true}
              slideNumberStyle={slideNumberStyle}
              captionPosition="bottom"
              automatic={true}
              dots={true}
              swipeScrollTolerance={0}
              transitiontime="100"
              slideBackgroundColor="grey"
              duration="0"
              slideImageFit="cover"
              thumbnails={false}
              thumbnailWidth="100px"
              style={{
                textAlign: "center",
                maxWidth: "850px",
                maxHeight: "500px",
                margin: "40px auto",
               
              }}
            />
}
           
              {/* Welcome Home

      <Chip
      label={currentUser.displayName}
      size={"large"}
      color="info"
      onClick={() => navigate(`/`)}
    /> */}
            </div>
            <br />

            {/* <Dots  className="dots"length={10} active={5} /> */}
          </div>
        </div>
  
    );
}

export default CarouselImage;
