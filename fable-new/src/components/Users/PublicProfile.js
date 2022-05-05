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
} from "@material-ui/core";
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
});

const PublicProfile = () => {
  let { currentUser } = useContext(AuthContext);
  let { profileUserId } = useParams();
  let [profileData, setProfileData] = useState(null);
  const classes = useStyles();
  //   if (profileUserId !== currentUser) {
  //     return (
  //       <div>
  //         <Alert severity="error">You don't have access to this resource!</Alert>
  //         {/* <Navigate to={"/login"}/>; */}
  //       </div>
  //     );
  //   }

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
        <Hero title={profileData.profile.displayName} subtitle={""} />
        <br />
        <Typography variant="h3" component={"h2"}>
          Stories written
        </Typography>
        <Grid container justifyContent="left">
          {profileData.profile &&
            profileData.profile.storiesCreated.map((createdStory) => {
              return (
                <Box sx={{ width: 200 }}>
                  <Card>
                    <CardContent>
                      <CardActionArea>
                        <Link to={`/stories/${createdStory._id}`}>
                          <CardHeader className={classes.storyLink} title={createdStory.title}></CardHeader>
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
                </Box>
              );
            })}
        </Grid>
      </div>
    );
  };

  return <div>{profileData && <div>{buildUserProfile(profileData)}</div>}</div>;
};

export default PublicProfile;
