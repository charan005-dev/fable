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
  media: { paddingRight: "auto", paddingLeft: "auto" },
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
                  <>
                    <Paper
                      elevation={20}
                      sx={{
                        bgcolor: "background.default",
                        display: "grid",
                        width: "400px",
                        gridTemplateColumns: { md: "1fr 1fr" },
                        gap: 2,
                      }}
                    >
                      <Grid container justifyContent="center">
                        <div>
                          <Stack className={classes.stack} direction={"row"} spacing={10}>
                            <span>
                              <Card>
                                <CardContent>
                                  <CardActionArea>
                                    <Link to={`/stories/${createdStory._id}`}>
                                      <Divider />
                                      <br />
                                      <CardMedia
                                        className={classes.media}
                                        component={"img"}
                                        alt={"book cover image"}
                                        image={createdStory.coverImage}
                                      />
                                    </Link>
                                  </CardActionArea>
                                </CardContent>
                              </Card>
                            </span>
                            <span>
                              <Card className={classes.title}>
                                <CardContent>
                                  <Link to={`/stories/${createdStory._id}`}>
                                    <CardHeader className={classes.storyLink} title={createdStory.title}></CardHeader>
                                    <Divider />
                                  </Link>
                                  <Typography variant="h5">{createdStory.shortDescription}</Typography>
                                </CardContent>
                              </Card>
                            </span>
                          </Stack>
                        </div>
                      </Grid>
                    </Paper>
                  </>
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
