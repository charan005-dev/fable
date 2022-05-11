import React from "react";
import CarouselImage from "./CarouselImage";
import HomeImage from "./HomeImage";
const Home = () => {
  return (
    <div>
      <div className="carousel">
        <CarouselImage />
      </div>
      <HomeImage />
    </div>
  );
};

export default Home;
