import { Carousel } from 'react-carousel-minimal';
import React, { useEffect, useState,useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../firebase/Auth";

function CarouselImage() {
    const { currentUser } = useContext(AuthContext);
    const [storyData, setStoryData] = useState(null);
    
    useEffect(() => {
        async function getAllStories() {
          const { data } = await axios.get(`/api/stories/all`, {
            userId: currentUser.uid,
          });
          console.log(data);
          let dataForCarousel = [];
          for (const story of data.stories) {
              dataForCarousel.push({
                  image: story.coverImage,
                  caption: story.title
              });
          }
          setStoryData(dataForCarousel);
        }
        getAllStories();
      }, [currentUser.uid]);


  const captionStyle = {
    fontSize: '2em',
    fontWeight: 'bold',
  }
  const slideNumberStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
  }

  if(storyData) 
  return (
    <div className="App">
      <div style={{ textAlign: "center" }}>
        <div style={{
          padding: "0 20px"
        }}>
          <Carousel
            data = {storyData}
            time={2000}
            width="850px"
            height="500px"
            captionStyle={captionStyle}
            radius="10px"
            slideNumber={true}
            slideNumberStyle={slideNumberStyle}
            captionPosition="bottom"
            automatic={true}
            dots={true}
            pauseIconColor="white"
            pauseIconSize="40px"
            slideBackgroundColor="darkgrey"
            slideImageFit="cover"
            thumbnails={true}
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