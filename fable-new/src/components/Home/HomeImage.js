import React, { useContext, useEffect, useState } from "react";
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
} from "@material-ui/core";
import { ThemeContext } from "../ThemeContext";
import { Stack } from "@mui/material";
import { useParams, Link } from "react-router-dom";
import { useTabContext } from "@mui/base";
import axios from "axios";
import { AuthContext } from "../../firebase/Auth";

const useStyles = makeStyles({
  card: {
    maxWidth: 250,
    height: "auto",
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
    height: "100px",
    width: "100px",
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

  media: {
    height: "auto",
    width: "450px",

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

  useEffect(() => {
    async function getAllStories() {
      const { data } = await axios.get(`/api/stories/all`, {
        userId: currentUser.uid,
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
          <Grid item xs={120} sm={70} md={60} lg={50} xl={100}>
            <div>
              <h2 className={classes.text1}>New and Hot</h2>
              {/* <div style={{ height: "2300px", width: "514px", margin: "16px" }}> */}
              <br />
              <br />
              <br />
              <div className="row_posters">
                <Stack direction={"row"} spacing={3}>
                  {storyData &&
                    storyData.map((image) => {
                      return (
                        <Paper className={classes.paper}>
                          {/* <img key={idx} src={`/images/${image}.jpg`} className="row_poster" alt="images" /> */}
                          <CardActionArea>
                            <Link to={`/stories/${image._id}`}>
                              <CardMedia className={classes.media} component="img" image={image.coverImage} />
                            </Link>
                          </CardActionArea>
                        </Paper>
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
