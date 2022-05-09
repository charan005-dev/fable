import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../../firebase/Auth";
import {
  Box,
  Card,
  CardActionArea,
  CardHeader,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Paper,
  Divider,
  TextField,
  makeStyles,
} from "@material-ui/core";
import { MDBCard, MDBCardTitle, MDBCardText, MDBCardBody, MDBCardImage, MDBRow, MDBCol } from "mdb-react-ui-kit";
import Hero from "../Hero";
const useStyles = makeStyles({
  storyLink: {
    textDecoration: "none",
  },
  imageWrapper: {},
  images: {
    margin: 15,
    border: "solid 1px black",
    borderRadius: "50%",
    boxShadow: "2px 2px 2px 2px",
    width: 150,
    height: 150,
  },
  title: {
    border: " 0px #fff",
    width: "auto",
    paddingRight: "100%",
  },
  stack: {
    width: "auto",
    height: "auto",
    paddingRight: "auto",
  },
  media: {
    width: "50%",
    height: "120px",
    height: "auto",
    float: "left",
    margin: "3px",
    padding: "3px",
  },

  cards: {
    width: "500px",
    height: "600px",
    marginLeft: "100%",
    marginRight: "100%",
    border: "3px solid black",
    borderRadius: "5px",
  },
  text: {
    color: "grey",
    justifyContent: "center",
    marginLeft: "44%",
    marginRight: "auto",
  },
  box: {
    paddingLeft: "auto",
    marginLeft: "44%",
    marginRight: "100%",
  },
  title: {
    color: "black",
    justifyContent: "center",
    fontSize: "30px",
    paddingLeft: "43.5%",
  },
});

const AllLibraryStories = () => {
  const { currentUser } = useContext(AuthContext);
  let { libraryId } = useParams();
  let [libraryData, setLibraryData] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    async function getLibraryStories() {
      const { data } = await axios.get(`/api/libraries/library_stories/${libraryId}?owner=${currentUser.uid}`);
      console.log(data.libraries);
      setLibraryData(data.libraries);
    }
    getLibraryStories();
  }, []);

  return (
    <div>
      <div>
        <Typography className={classes.title} subtitle={""}>
          {libraryData && libraryData.libraryName}
        </Typography>
      </div>
      <br />
      <br />
      <br />

      <div className="movieRow"></div>
      <Box className={classes.box}>
        {libraryData &&
          libraryData.stories.map((libraryStory) => {
            return (
              <>
                <MDBCard>
                  <MDBRow className={classes.cards}>
                    <MDBCol>
                      <Link to={`/stories/${libraryStory._id}`}>
                        <MDBCardImage src={libraryStory.coverImage} alt="..." fluid />
                      </Link>
                    </MDBCol>
                    <MDBCard>
                      <MDBCardBody>
                        <Link to={`/stories/${libraryStory._id}`}>
                          <MDBCardText className="text">{libraryStory.title}</MDBCardText>
                        </Link>
                        <MDBCardText>
                          <small className="text">{libraryStory.shortDescription}</small>
                        </MDBCardText>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBRow>
                </MDBCard>
                <br />
              </>
            );
          })}
      </Box>
    </div>
  );
};

export default AllLibraryStories;
