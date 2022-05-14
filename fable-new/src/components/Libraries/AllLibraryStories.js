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
import { Skeleton } from "@mui/material";
import {
  MDBCard,
  MDBCardTitle,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";
import Hero from "../Hero";
import { Stack } from "react-bootstrap";

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
    height: "300px",
    width: "100%",
  },

  cards: {
    width: "20vw",
    height: "9vw",
    marginLeft: "100%",
    marginRight: "100%",
    marginBottom: "9%",
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
  paper1: {
   
    height: "auto",
    width: "20%",
    marginLeft: "5%",
    marginRight: "auto",
    borderRadius: 5,
    border: "0px solid #000",
    marginBottom: "1%",
    marginTop: "2%",
  },

  paper2: {
    width: "13%",
    marginLeft: "43.5%",
    paddingLeft: "auto",
    paddingRight: "auto",
  },
  paperfirst: {
    height: "350px",
    width: "auto",
    marginLeft: "60%",
    marginRight: "auto",
    borderRadius: 5,
    border: "0px solid #000",
    marginBottom: "1%",
    marginTop: "7%",
    maxHeight: "29vw",
    maxWidth: "10vw",
  },
  papersecond: {
    width: "20%",
    height: "350px",
  },
  media: {
    height: "20%",
    width: "20%",
  },
});

const AllLibraryStories = () => {
  const { currentUser } = useContext(AuthContext);
  let { libraryId } = useParams();
  let [libraryData, setLibraryData] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    async function getLibraryStories() {
      const { data } = await axios.get(
        `/api/libraries/library_stories/${libraryId}?owner=${currentUser.uid}`,
        {
          headers: { authtoken: await currentUser.getIdToken() },
        }
      );
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

      <div className="movieRow"></div>
      <Stack direction="column"> 
      <Paper>
        {libraryData &&
          libraryData.stories.map((libraryStory) => {
            return (
              <>
                <Stack direction="row">
                  <Paper className="paper1">
                    <Card className={classes.paper1} elevation={15}>
                      <CardMedia
                        component="img"
                        image={libraryStory.coverImage}
                      />
                    </Card>
                  </Paper>

                  <Paper>
                    <Card className={classes.paper1} elevation={15}>
                     <Typography>{libraryStory.title}</Typography>
                    </Card>
                  </Paper> 

                </Stack>
              </>
            );
          })} 
          </Paper>
      </Stack> 
    </div>
  );
};

export default AllLibraryStories;
