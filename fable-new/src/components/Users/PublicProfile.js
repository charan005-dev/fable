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
import { MDBCard, MDBCardTitle, MDBCardText, MDBCardBody, MDBCardImage, MDBRow, MDBCol } from "mdb-react-ui-kit";
import Hero from "../Hero";
import { makeStyles } from "@material-ui/styles";

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
    marginLeft: "11.5%",
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
  card1: {
    width: "auto",
    height: "8%",
    marginLeft: "10%",
    paddingLeft: "0%",
    paddingRight: "0%",
    marginRight: "2%",
    paddingBottom: "0%",
    marginBottom: "1%",
    fontSize: "25px",
  },
  card2: {
    width: "15%",
    marginBottom: "100px",
    paddingBottom: "2%",
    height: "2%",
  },
  media: {
    height: "300px",
    width: "200px",
  },
});

const PublicProfile = () => {
  let { currentUser } = useContext(AuthContext);
  let { profileUserId } = useParams();
  let [profileData, setProfileData] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    async function getProfileData() {
      const { data } = await axios.get(`/api/users/public_profile/${profileUserId}`, {
        headers: { authtoken: await currentUser.getIdToken() },
      });
      setProfileData(data);
      console.log(data);
    }
    getProfileData();
  }, [profileUserId]);

  const [scrollX, setScrollX] = useState(0);
  const buildUserProfile = (profileData) => {
    return (
      <Grid>
        <Typography variant="h2" component={"h2"} className={classes.text}>
          {profileData.profile.displayName}
        </Typography>
        <br />
        <Typography variant="h3" component={"h2"} className={classes.text}>
          Stories written
        </Typography>
        <br />
        <br />
        <br />
        <Stack direction="column">
          {profileData.profile &&
            profileData.profile.storiesCreated.map((createdStory) => {
              return (
                <Grid>
                  <Stack direction="row">
                    <Card className={classes.card1} elevation={15}>
                      <CardMedia className={classes.media} component="img" image={createdStory.coverImage} />
                    </Card>
                    <Card className={classes.card2} elevation={0}>
                      <CardContent>
                        <Typography>{createdStory.title}</Typography>
                      </CardContent>
                      <CardContent>
                        <Typography>
                          {createdStory.shortDescription.length > 200
                            ? createdStory.shortDescription.substring(0, 197) + "..."
                            : createdStory.shortDescription}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Stack>
                </Grid>
              );
            })}
        </Stack>
      </Grid>
    );
  };
  return <div>{profileData && <div>{buildUserProfile(profileData)}</div>}</div>;
};

export default PublicProfile;
