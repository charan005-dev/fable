import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { useContext } from "react";
import { AuthContext } from "../../firebase/Auth";
import CarouselImage from "./CarouselImage";
import HomeImage from "./HomeImage";

const useStyles = makeStyles({
  storyLink: {
    textDecoration: "none",
    fontWeight:"bolder"
  },
});

const Home = () => {
  const classes = useStyles();

  let { currentUser } = useContext(AuthContext);
  return (
    <div>
      <div className="carousel">
        <CarouselImage />
      </div>
       
      &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;Welcome 
      <Typography variant="h5" component={"h1"} className={classes.storyLink}>
        
      &nbsp;&nbsp; &nbsp;&nbsp; {currentUser.displayName &&
          currentUser.displayName + "!"}
      </Typography>
      <br />
      <HomeImage />
      {/* <HomeTest /> */}
    </div>
  );
};

export default Home;
