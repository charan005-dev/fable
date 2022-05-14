import { Alert, Avatar, Fab, Stack } from "@mui/material";
import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../firebase/Auth";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Paper,
  Divider,
  Button,
  CardActionArea,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Badge } from "@material-ui/core";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Edit from "@mui/icons-material/Edit";
import ViewLibrariesList from "../Libraries/ViewLibrariesList";

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
    color: "Black",
    justifyContent: "center",
    marginLeft: "11.5%",
    marginRight: "auto",
  },
  text1: {
    color: "grey",
    justifyContent: "center",
    marginLeft: "80%",
    marginRight: "auto",
  },
  text2: {
    color: "grey",
    justifyContent: "center",
    marginLeft: "0%",
    marginRight: "auto",
  },
  text3: {
    color: "grey",
    justifyContent: "center",
    marginLeft: "0%",
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
    paddingLeft: 40,
  },
  card1: {
    width: "100%",
    height: "8%",
    marginLeft: "0%",
    paddingLeft: "0%",
    paddingRight: "0%",
    marginRight: "0%",
    paddingBottom: "0%",
    marginBottom: "1%",
    fontSize: "25px",
  },
  // card2: {
  //   width: 600,
  //   marginBottom: "100px",
  //   // paddingLeft:"10%",
  //   paddingBottom: "2%",
  //   height: "2%",
  //   paddingLeft: "2%",
  //   paddingRight: "50%",
  // },
  card3: {
    width: "100%",
    height: "auto",
    marginLeft: "17%",
    paddingLeft: "0%",
    paddingRight: "0%",
    marginRight: "auto",
    paddingBottom: "0%",
    marginBottom: "1%",
    fontSize: "25px",
  },
  // card4: {
  //   width: "60%",
  //   marginLeft: "30px",
  // },
  media: {
    height: "300px",
    width: "200px",
  },
  namecard: {
    paddingTop: 15,
    // paddingLeft: 200,
    // paddingBottom: 20,
    // paddingTop: "3%",
    // color: "black",
  },
  subcard: {
    width: "6%",
  },
  cardpaper: {
    width: "40vw",
    marginRight: "10%",
    marginLeft: "6%",
    marginBottom: "10%",
    height: "auto",
  },
  cardpaper1: {
    width: "40vw",
    marginRight: "10%",
    marginLeft: "0%",
    marginBottom: "10%",
    height: "auto",
  },
  editButton: {
    border: "solid 1px",
    padding: "1px",
    float: "right",
    marginTop: 23,
    marginLeft: 20,
    marginRight: 5,
    height: 8,
    width: 35,
    backgroundColor: "black",
    color: "white",

    "&:hover": {
      backgroundColor: "white",
      color: "black",
      radius: "solid 1px",
    },
  },
  text4: {
    marginLeft: 100,
  },
  editicon: {
    fontSize: "medium",
  },
  avatar: {
    marginTop: 6,
    marginRight: 10,
  },
  box1: {
    width: "80%",
  },
  libraryCol: {
    maxWidth: 70,
  },
});

const PublicProfile = () => {
  let { currentUser } = useContext(AuthContext);
  let { profileUserId } = useParams();
  let [profileData, setProfileData] = useState(null);
  let [libraryData, setLibraryData] = useState([]);
  const classes = useStyles();
  const navigate = useNavigate();

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

  useEffect(() => {
    async function getOwnerLibraries() {
      const { data } = await axios.get(`/api/libraries/me`, {
        headers: { authtoken: await currentUser.getIdToken() },
      });
      console.log("Content", data);
      if (data.libraries) setLibraryData(data.libraries);
    }
    getOwnerLibraries();
  }, []);

  const [scrollX, setScrollX] = useState(0);
  const buildUserProfile = (profileData) => {
    return (
      <>
        <Grid>
          <Card elevation={15} className={classes.namecard}>
            <Grid container justifyContent="center">
              {!profileData.profile.userAvatar && (
                <Avatar sx={{ width: 64, height: 64 }} className={classes.avatar}>
                  {profileData.profile.displayName.substring(0, 2)}
                </Avatar>
              )}
              {profileData.profile.userAvatar && (
                <Avatar
                  sx={{ width: 64, height: 64 }}
                  src={profileData.profile.userAvatar}
                  className={classes.avatar}
                ></Avatar>
              )}
            </Grid>
            <br />
            <Divider />
            <br />
            <Grid container justifyContent="center">
              <Typography variant="h2" component={"h2"}>
                {profileData.profile.displayName}
              </Typography>
              {currentUser.uid === profileData.profile._id && (
                <Fab className={classes.editButton} onClick={() => navigate(`/users/${profileData.profile._id}/edit`)}>
                  <Edit />
                </Fab>
              )}
            </Grid>
            <br />
            <br />
            <Stack direction="row" className={classes.card3} spacing={5}>
              <Card className={classes.subcard} elevation={0}>
                <Typography variant="h6" component={"h2"} className={classes.text1}>
                  <MenuBookIcon />
                </Typography>
              </Card>
              &nbsp; &nbsp;
              <Card className={classes.subcard} elevation={0}>
                <Typography variant="h6" component={"h2"} className={classes.text1}>
                  <LibraryAddIcon />
                </Typography>
              </Card>
            </Stack>
          </Card>
          <br />
          {/* <Grid> */}
          <Stack direction="row" className={classes.libraryCol} spacing={2}>
            <span>
              <div>
                <br />
                <br />
                <br />
                <Stack direction="row">
                  <Paper className={classes.cardpaper} elevation={0}>
                    <Card className={classes.cardpaper} elevation={10}>
                      <Typography variant="h3" component={"h2"} className={classes.text}>
                        Stories Written
                      </Typography>
                      <br />
                      <Stack direction={"column"} spacing={2}>
                        {profileData &&
                          profileData.profile.storiesCreated.map((profile, idx) => {
                            if (idx > 2) {
                              return;
                            }
                            return (
                              <Stack direction="row" spacing={5}>
                                <Card>
                                  <CardActionArea>
                                    <Link to={`/stories/${profile._id}`}>
                                      <CardMedia className={classes.media} component="img" image={profile.coverImage} />
                                    </Link>
                                  </CardActionArea>
                                </Card>
                                <Card elevation={0}>
                                  <Link to={`/stories/${profile._id}`}>
                                    <Typography style={{ textTransform: "uppercase" }}>{profile.title}</Typography>
                                  </Link>
                                  <br />
                                  <Typography variant="h7">
                                    {" "}
                                    <FavoriteIcon /> &nbsp;
                                    {" " + profile.likedBy.length}
                                  </Typography>
                                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                  <Typography variant="h7">
                                    {" "}
                                    <VisibilityIcon />
                                    {" " + profile.visitedBy.length}
                                  </Typography>
                                  <Typography>
                                    {profile.shortDescription.length > 50
                                      ? profile.shortDescription.substring(0, 50) + "...."
                                      : profile.shortDescription}
                                  </Typography>
                                </Card>
                              </Stack>
                            );
                          })}
                      </Stack>
                      <Button onClick={() => navigate(`/stories/manage`)}>View More</Button>
                    </Card>
                  </Paper>
                  <Paper className={classes.cardpaper1} elevation={0}>
                    <Card className={classes.cardpaper1} elevation={10}>
                      <Typography variant="h3" component={"h2"} className={classes.text}>
                        Your Libraries
                      </Typography>
                      <br />
                      <Stack direction="column" spacing={2}>
                        {libraryData && libraryData.length === 0 && (
                          <div>
                            <Typography variant="body2">
                              <Link to={`/libraries/create`}>Click here</Link> to create a new library.
                            </Typography>
                          </div>
                        )}
                        {libraryData &&
                          libraryData.length > 0 &&
                          libraryData.map((lib, idx) => {
                            return (
                              <Card>
                                <CardContent>
                                  <Stack direction="row" spacing={2}>
                                    <Badge anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
                                      <LibraryBooksIcon />
                                    </Badge>
                                    <Link to={`/libraries/${lib._id}`}>
                                      <Typography variant="body1">
                                        {lib.libraryName.length > 20
                                          ? lib.libraryName.length.substring(16) + "..."
                                          : lib.libraryName}
                                      </Typography>
                                    </Link>
                                    {/* <CardActionArea>
                                      <Link to={`/stories/${libraryData.stories._id}`}>
                                        <CardMedia></CardMedia>
                                      </Link>
                                    </CardActionArea> */}
                                    <Typography variant="overline">({lib.stories.length} Stories Inside)</Typography>
                                  </Stack>
                                </CardContent>
                              </Card>
                            );
                          })}
                      </Stack>
                    </Card>
                  </Paper>
                </Stack>

                <br />
              </div>
              {/* </Stack> */}
            </span>
          </Stack>
          {/* </Grid> */}
        </Grid>
      </>
    );
  };
  return <div>{profileData && <div>{buildUserProfile(profileData)}</div>}</div>;
};

export default PublicProfile;
