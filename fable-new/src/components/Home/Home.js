import { Typography } from "@material-ui/core";
import React, { useContext } from "react";
import { AuthContext } from "../../firebase/Auth";
import CarouselImage from "./CarouselImage";
import HomeImage from "./HomeImage";

const Home = () => {
  let { currentUser } = useContext(AuthContext);
  return (
    <div>
      
      <div className="carousel">
        <CarouselImage />
      </div>
      <Typography variant="h5" component={"h1"}>

      {currentUser.displayName && "Welcome,  " + currentUser.displayName + "!"}
      </Typography>
      <br />
      <HomeImage />
      {/* <HomeTest /> */}
    </div>
  );
};

export default Home;
