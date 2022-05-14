import React, { useContext, useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import {
  Card,
  Box,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  makeStyles,
  Paper,
  CircularProgress,
  Button,
} from "@material-ui/core";
import { ThemeContext } from "../ThemeContext";
import { CardHeader, Stack, Tooltip } from "@mui/material";
import { Chip } from "@material-ui/core";
import { useParams, Link } from "react-router-dom";
import { useTabContext } from "@mui/base";
import axios from "axios";
import { AuthContext } from "../../firebase/Auth";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import { doSignOut } from "../../firebase/FirebaseFunctions";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  card: {
    height: 250,
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 5,
    background: "#0000",
    border: "1px solid #ffff",
    boxShadow: "0 19px 38px rgba(0,0,0,0.5), 0 15px 12px rgba(0,0,0,0);",
  },
  titleHead: {
    fontWeight: "bold",
    color: "white",
  },
  grid: {
    flexGrow: 5,
  },
  media: {
    height: "250px",
    width: "200px",
    "&hover": {
      opacity: 0,
    },
  },
  paper: {
    height: "auto",
    width: "auto",

    marginBottom: "5%",
    height: "80%",
  },
  image: {
    height: "auto",
  },
  text1: {
    marginLeft: "20px",
    marginRight: "auto",
  },

  overlay: {
    transition: ".5s ease",
    opacity: 0,
    position: "absolute",
    top: "75%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    "&:hover": {
      opacity: 1,
    },
  },
});

function HomeImage() {
  const context = useContext(ThemeContext);
  const darkMode = context.theme.darkMode;
  //--------------------------------------------------------------------------------------------------------------------------------//

  // let data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
  // const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [storyData, setStoryData] = useState(null);
  const [hover, setHover] = useState(false);
  const classes = useStyles();
  const navigate = useNavigate();

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const onHover = () => {
    setHover(!hover);
  };
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  useEffect(() => {
    // required, genres (Drama), hot (true/false)
    async function getAllStories() {
      const { data } = await axios.get(`/api/stories/all?required=12&hot=true`, {
        headers: { authtoken: await currentUser.getIdToken() },
      });
      console.log(data);
      setStoryData(data.stories);
    }
    getAllStories();
  }, []);
  if (storyData) {
    return (
      <>

<Paper
          elevation={15}
          className={classes.paper}
          sx={{
            bgcolor: "background.default",
            display: "grid",
            gridTemplateColumns: { md: "1fr 1fr" },
            gap: 2,
          }}
        >
          <Grid item>
            <div>
              <br />
              <h2 className={classes.text1}>New and Hot</h2>
              {/* <div style={{ height: "2300px", width: "514px", margin: "16px" }}></div> */}
              <div className="row_posters">
                <Stack direction={"row"} spacing={4}>
                  {storyData &&
                    storyData.map((image) => {
                      return (
                        <>
                          {/* <ImageList> */}

                          <Box>
                            <Card className={classes.card}>
                              <CardActionArea>
                                {/* <Typography>{hover && image.title} </Typography> */}
                                <ImageListItem>
                                  <Link to={`/stories/${image._id}`}>
                                    <CardMedia
                                      className={classes.media}
                                      component="img"
                                      image={image.coverImage}
                                      onMouseEnter={onHover}
                                      onMouseLeave={onHover}
                                    />
                                    <ImageListItemBar title={image.title}></ImageListItemBar>
                                  </Link>
                                </ImageListItem>
                              </CardActionArea>
                            </Card>
                            <br />
                            <Stack direction="row" spacing={0.5}>
                              {image.genres &&
                                image.genres.map((genre, idx) => {
                                  if (idx > 2) {
                                    return;
                                  }
                                  return (
                                    <Chip
                                      label={genre}
                                      size={"small"}
                                      color="info"
                                      onClick={() => navigate(`/stories/choose/${genre}`)}
                                    />
                                  );
                                })}
                            </Stack>
                          </Box>

                          {/* </ImageList> */}
                        </>
                      );
                    })}
                </Stack>
              </div>
              {/* </div> */}
            </div>
          </Grid>
        </Paper>

        <Paper
          elevation={15}
          className={classes.paper}
          sx={{
            bgcolor: "background.default",
            display: "grid",
            gridTemplateColumns: { md: "1fr 1fr" },
            gap: 2,
          }}
        >
          <Grid item>
            <div>
              <br />
              <h2 className={classes.text1}>New and Hot</h2>
              {/* <div style={{ height: "2300px", width: "514px", margin: "16px" }}></div> */}
              <div className="row_posters">
                <Stack direction={"row"} spacing={4}>
                  {storyData &&
                    storyData.map((image) => {
                      return (
                        <>
                          {/* <ImageList> */}

                          <Box>
                            <Card className={classes.card}>
                              <CardActionArea>
                                {/* <Typography>{hover && image.title} </Typography> */}
                                <ImageListItem>
                                  <Link to={`/stories/${image._id}`}>
                                    <CardMedia
                                      className={classes.media}
                                      component="img"
                                      image={image.coverImage}
                                      onMouseEnter={onHover}
                                      onMouseLeave={onHover}
                                    />
                                    <ImageListItemBar title={image.title}></ImageListItemBar>
                                  </Link>
                                </ImageListItem>
                              </CardActionArea>
                            </Card>
                            <br />
                            <Stack direction="row" spacing={0.5}>
                              {image.genres &&
                                image.genres.map((genre, idx) => {
                                  if (idx > 2) {
                                    return;
                                  }
                                  return (
                                    <Chip
                                      label={genre}
                                      size={"small"}
                                      color="info"
                                      onClick={() => navigate(`/stories/choose/${genre}`)}
                                    />
                                  );
                                })}
                            </Stack>
                          </Box>

                          {/* </ImageList> */}
                        </>
                      );
                    })}
                </Stack>
              </div>
              {/* </div> */}
            </div>
          </Grid>
        </Paper>


        <Paper
          elevation={15}
          className={classes.paper}
          sx={{
            bgcolor: "background.default",
            display: "grid",
            gridTemplateColumns: { md: "1fr 1fr" },
            gap: 2,
          }}
        >
          <Grid item>
            <div>
              <br />
              <h2 className={classes.text1}>New and Hot</h2>
              {/* <div style={{ height: "2300px", width: "514px", margin: "16px" }}></div> */}
              <div className="row_posters">
                <Stack direction={"row"} spacing={4}>
                  {storyData &&
                    storyData.map((image) => {
                      return (
                        <>
                          {/* <ImageList> */}

                          <Box>
                            <Card className={classes.card}>
                              <CardActionArea>
                                {/* <Typography>{hover && image.title} </Typography> */}
                                <ImageListItem>
                                  <Link to={`/stories/${image._id}`}>
                                    <CardMedia
                                      className={classes.media}
                                      component="img"
                                      image={image.coverImage}
                                      onMouseEnter={onHover}
                                      onMouseLeave={onHover}
                                    />
                                    <ImageListItemBar title={image.title}></ImageListItemBar>
                                  </Link>
                                </ImageListItem>
                              </CardActionArea>
                            </Card>
                            <br />
                            <Stack direction="row" spacing={0.5}>
                              {image.genres &&
                                image.genres.map((genre, idx) => {
                                  if (idx > 2) {
                                    return;
                                  }
                                  return (
                                    <Chip
                                      label={genre}
                                      size={"small"}
                                      color="info"
                                      onClick={() => navigate(`/stories/choose/${genre}`)}
                                    />
                                  );
                                })}
                            </Stack>
                          </Box>

                          {/* </ImageList> */}
                        </>
                      );
                    })}
                </Stack>
              </div>
              {/* </div> */}
            </div>
          </Grid>
        </Paper>



        <Paper
          elevation={15}
          className={classes.paper}
          sx={{
            bgcolor: "background.default",
            display: "grid",
            gridTemplateColumns: { md: "1fr 1fr" },
            gap: 2,
          }}
        >
          <Grid item>
            <div>
              <br />
              <h2 className={classes.text1}>New and Hot</h2>
              {/* <div style={{ height: "2300px", width: "514px", margin: "16px" }}></div> */}
              <div className="row_posters">
                <Stack direction={"row"} spacing={4}>
                  {storyData &&
                    storyData.map((image) => {
                      return (
                        <>
                          {/* <ImageList> */}

                          <Box>
                            <Card className={classes.card}>
                              <CardActionArea>
                                {/* <Typography>{hover && image.title} </Typography> */}
                                <ImageListItem>
                                  <Link to={`/stories/${image._id}`}>
                                    <CardMedia
                                      className={classes.media}
                                      component="img"
                                      image={image.coverImage}
                                      onMouseEnter={onHover}
                                      onMouseLeave={onHover}
                                    />
                                    <ImageListItemBar title={image.title}></ImageListItemBar>
                                  </Link>
                                </ImageListItem>
                              </CardActionArea>
                            </Card>
                            <br />
                            <Stack direction="row" spacing={0.5}>
                              {image.genres &&
                                image.genres.map((genre, idx) => {
                                  if (idx > 2) {
                                    return;
                                  }
                                  return (
                                    <Chip
                                      label={genre}
                                      size={"small"}
                                      color="info"
                                      onClick={() => navigate(`/stories/choose/${genre}`)}
                                    />
                                  );
                                })}
                            </Stack>
                          </Box>

                          {/* </ImageList> */}
                        </>
                      );
                    })}
                </Stack>
              </div>
              {/* </div> */}
            </div>
          </Grid>
        </Paper>





        <Paper
          elevation={15}
          className={classes.paper}
          sx={{
            bgcolor: "background.default",
            display: "grid",
            gridTemplateColumns: { md: "1fr 1fr" },
            gap: 2,
          }}
        >
          <Grid item>
            <div>
              <br />
              <h2 className={classes.text1}>New and Hot</h2>
              {/* <div style={{ height: "2300px", width: "514px", margin: "16px" }}></div> */}
              <div className="row_posters">
                <Stack direction={"row"} spacing={4}>
                  {storyData &&
                    storyData.map((image) => {
                      return (
                        <>
                          {/* <ImageList> */}

                          <Box>
                            <Card className={classes.card}>
                              <CardActionArea>
                                {/* <Typography>{hover && image.title} </Typography> */}
                                <ImageListItem>
                                  <Link to={`/stories/${image._id}`}>
                                    <CardMedia
                                      className={classes.media}
                                      component="img"
                                      image={image.coverImage}
                                      onMouseEnter={onHover}
                                      onMouseLeave={onHover}
                                    />
                                    <ImageListItemBar title={image.title}></ImageListItemBar>
                                  </Link>
                                </ImageListItem>
                              </CardActionArea>
                            </Card>
                            <br />
                            <Stack direction="row" spacing={0.5}>
                              {image.genres &&
                                image.genres.map((genre, idx) => {
                                  if (idx > 2) {
                                    return;
                                  }
                                  return (
                                    <Chip
                                      label={genre}
                                      size={"small"}
                                      color="info"
                                      onClick={() => navigate(`/stories/choose/${genre}`)}
                                    />
                                  );
                                })}
                            </Stack>
                          </Box>

                          {/* </ImageList> */}
                        </>
                      );
                    })}
                </Stack>
              </div>
              {/* </div> */}
            </div>
          </Grid>
        </Paper>



        
      </>
    );
  }
}

export default HomeImage;
