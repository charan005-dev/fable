import { Alert, Stack } from "@mui/material";
import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
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
} from "@material-ui/core";
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
import { makeStyles } from "@material-ui/styles";
import { maxHeight } from "@mui/system";

/* This component will take care of displaying
    - a user's public profile
    - their works
*/

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
    width: '50%',
    height: '120px',
    height: 'auto',
    float: 'left',
    margin: '3px',
    padding: '3px'
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

const PublicProfile = () => {
  let { currentUser } = useContext(AuthContext);
  let { profileUserId } = useParams();
  let [profileData, setProfileData] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    async function getProfileData() {
      const { data } = await axios.get(
        `/api/users/public_profile/${profileUserId}`
      );
      setProfileData(data);
      console.log(data);
    }
    getProfileData();
  }, [profileUserId]);

  const [scrollX, setScrollX] = useState(0);

  const buildUserProfile = (profileData) => {
    return (
      <div>
        <div>
          <Typography className={classes.title} subtitle={""}>
            {profileData.profile.displayName}
          </Typography>
        </div>
        <br />
        <Typography variant="h3" component={"h2"} className={classes.text}>
          Stories written
        </Typography>
        <br />
        <br />

        <div className="movieRow"></div>
        <Box className={classes.box}>
          {profileData.profile &&
            profileData.profile.storiesCreated.map((createdStory) => {
              return (
                <>
                  <MDBCard >
                    <MDBRow className={classes.cards}>
                      <MDBCol>
                        <MDBCardImage
                          src={createdStory.coverImage}
                          alt="..."
                          fluid
                        />
                      </MDBCol>
                      <MDBCard>
                        <MDBCardBody>
                          <MDBCardText className="text">
                            {createdStory.title}
                          </MDBCardText>

                          <MDBCardText>
                            <small className="text">
                              {createdStory.shortDescription}
                            </small>
                          </MDBCardText>
                        </MDBCardBody>
                      </MDBCard>
                    </MDBRow>
                  </MDBCard>

                  {/* <Grid className={classes.cards} direction="column">
                    <CardActionArea component="a" href="#">
                      <Card sx={{ display: "flex" }}>
                        <CardMedia
                          component="img"
                          image={createdStory.coverImage}
                          alt="image"
                          className={classes.media}
                        />

                        <CardContent sx={{ flex: 1 }}>
                          <Typography component="h2" variant="h5">
                            {createdStory.title}
                          </Typography>

                          <Typography variant="subtitle1" color="primary">
                            {createdStory.shortDescription}
                          </Typography>
                        </CardContent>
                      </Card>
                    </CardActionArea>
                    <br />
                  </Grid> */}
                  <br />
                </>
              );
            })}
        </Box>
      </div>
    );
  };

  return <div>{profileData && <div>{buildUserProfile(profileData)}</div>}</div>;
};

export default PublicProfile;
