import { Carousel } from "react-carousel-minimal";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../firebase/Auth";
import { Link } from "react-router-dom";
import { jsx } from "@emotion/react";

function CarouselImage() {
  const { currentUser } = useContext(AuthContext);
  const [storyData, setStoryData] = useState(null);
  const [storyIds, setStoryIds] = useState([]);
  const navigate = useNavigate();

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
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              padding: "0 20px",
            }}
          >
            <Carousel
              data={storyData}
              time={2000}
              width="850px"
              height="250px"
              captionStyle={captionStyle}
              radius="10px"
              slideNumber={true}
              slideNumberStyle={slideNumberStyle}
              captionPosition="bottom"
              automatic={true}
              dots={true}
              swipeScrollTolerance="0"
             
          
              slideBackgroundColor="grey"
              // slideBackgroundtime="none"
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
          </div>
        </div>
      </div>
    );
}

export default CarouselImage;
