import React, { useContext } from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  makeStyles,
  CircularProgress,
} from "@material-ui/core";
import "../App.css";
import { ThemeContext } from "./ThemeContext";

const useStyles = makeStyles({
  card: {
    maxWidth: 250,
    height: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 5,
    background: "#420101",
    border: "1px solid #1e8678",
    boxShadow: "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
  },
  titleHead: {
    fontWeight: "bold",
    color: "white",
  },
  grid: {
    flexGrow: 1,
    flexDirection: "row",
  },
  media: {
    height: "100%",
    width: "100%",
  },
  button: {
    color: "#1e8678",
    fontWeight: "bold",
    fontSize: 12,
  },
});

function Home() {
  // const context = useContext(ThemeContext);
  // const darkMode = context.theme.darkMode;
  const classes = useStyles();
  // console.log(data);
  let data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  let card = null;

  const buildCard = (idx) => {
    return (
      <>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={idx}>
          <br />
          <Card className={classes.card} variant="outlined">
            <CardMedia className={classes.media} component="img" image={`/images/${idx}.jpg`} title="images" />
          </Card>
        </Grid>
      </>
    );
  };

  card =
    data &&
    data.map((idx, index) => {
      return buildCard(idx);
    });
  return (
    <div className="Home">
      <nav className="navigation">
        <h1></h1>
      </nav>
      {/* <h1 className={`heading ${darkMode ? "heading-dark" : "heading-light"}`}>
        {darkMode ? "Dark Mode" : "Light Mode"}
      </h1>
      <p className={`para ${darkMode ? "para-dark" : "para-light"}`}>This is a test for switching theme!!</p> */}
      <Grid container alignItems="center" justifyContent="center" spacing={5}>
        {card}
      </Grid>
    </div>
  );
}

export default Home;
