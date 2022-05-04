import React, { useContext } from "react";
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
    height: "100%",
    width: "100%",
  },
  paper: {
    height: "auto",
    width: "auto",
  },
  image: {
    height: "auto",
  },
});

function HomeImage() {
  const context = useContext(ThemeContext);
  const darkMode = context.theme.darkMode;
  const classes = useStyles();
  //--------------------------------------------------------------------------------------------------------------------------------//

  let data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

  return (
    <>
      <Grid item xs={120} sm={70} md={60} lg={50} xl={100}>
        <div className="row">
          <h2 className={`heading ${darkMode ? "heading-dark" : "heading-light"}`}>Images</h2>

          {/* <div style={{ height: "2300px", width: "514px", margin: "16px" }}> */}
          <br />
          <br />
          <br />
          <div className="row_posters">
            <Stack direction={"row"} spacing={3}>
              {data &&
                data.map((image, idx) => {
                  return (
                    <Paper className={classes.paper}>
                      <img key={idx} src={`/images/${image}.jpg`} className="row_poster" alt="images" />
                    </Paper>
                  );
                })}
            </Stack>
          </div>
          {/* </div> */}
        </div>
      </Grid>
    </>
  );
}

export default HomeImage;
