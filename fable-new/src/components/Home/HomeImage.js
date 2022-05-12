import React, { useContext, useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import {
  Card,
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
import { useParams, Link } from "react-router-dom";
import { useTabContext } from "@mui/base";
import axios from "axios";
import { AuthContext } from "../../firebase/Auth";
import { doSignOut } from "../../firebase/FirebaseFunctions";

const useStyles = makeStyles({
  card: {
    maxWidth: 200,
    height: 250,
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 5,
    background: "#0000",
    border: "1px solid #1e8678",
    boxShadow: "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
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
  },
  paper: {
    height: "auto",
    width: "auto",
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
  const classes = useStyles();

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  useEffect(() => {
    async function getAllStories() {
      const { data } = await axios.get(`/api/stories/all`, {
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
          elevation={20}
          sx={{
            bgcolor: "background.default",
            display: "grid",
            gridTemplateColumns: { md: "1fr 1fr" },
            gap: 2,
          }}
        >
          <Grid>
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
                          <Card sx={{ maxWidth: 345 }} className={classes.card}>
                            <CardActionArea>
                              <Link to={`/stories/${image._id}`}>
                                <CardMedia
                                  className={classes.media}
                                  component="img"
                                  image={image.coverImage}
                                />
                              </Link>
                              <Typography></Typography>
                            </CardActionArea>
                          </Card>

                          {image.genres &&
                            image.genres.map((genre) => {
                              return (
                                <Link to={`/stories/choose/${genre}`}>
                                  {genre}
                                </Link>
                              );
                            })}
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
