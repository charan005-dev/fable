import { Alert } from "@mui/material";
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
} from "@material-ui/core";
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
});

const PublicProfile = () => {
  let { currentUser } = useContext(AuthContext);
  let { profileUserId } = useParams();
  let [profileData, setProfileData] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    async function getProfileData() {
      const { data } = await axios.get(`/api/users/public_profile/${profileUserId}`);
      setProfileData(data);
      console.log(data);
    }
    getProfileData();
  }, [profileUserId]);

  const buildUserProfile = (profileData) => {
    return (
      <div>
        <div>
          <Hero title={profileData.profile.displayName} subtitle={""} />

          <div className={classes.imageWrapper}>
            <img className={classes.images} src={profileData.profile.userAvatar} alt="user" />
          </div>
        </div>
        <br />
        <Typography variant="h3" component={"h2"}>
          Stories written
        </Typography>
        <Box sx={{ width: 200 }}>
          <Grid container justifyContent="left">
            {profileData.profile &&
              profileData.profile.storiesCreated.map((createdStory) => {
                return (
                  <Card>
                    <CardContent>
                      <CardActionArea>
                        <Link to={`/stories/${createdStory._id}`}>
                          <CardHeader className={classes.storyLink} title={createdStory.title}></CardHeader>
                          <Divider />
                          <br />
                          <CardMedia
                            sx={{ width: 50 }}
                            component={"img"}
                            alt={"book cover image"}
                            image={createdStory.coverImage}
                          />
                        </Link>
                      </CardActionArea>
                    </CardContent>
                  </Card>
                );
              })}
          </Grid>
        </Box>
      </div>
    );
  };

  return <div>{profileData && <div>{buildUserProfile(profileData)}</div>}</div>;
};

export default PublicProfile;
