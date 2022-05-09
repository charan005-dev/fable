import { Paper, Typography } from "@material-ui/core";
import React from "react"; 
import { makeStyles } from "@material-ui/styles";
const useStyles = makeStyles({
  storyBook: {
    margin: 100,
  },
  fab: {
    marginLeft: "41%", 
    paddingTop:"1%", 
    paddingBottom: "1%"
  },
  

});

const Hero = ({ title, subtitle }) => { 
  const classes = useStyles();
  return (
    <Paper
      elevation={11}
      sx={{
        bgcolor: "background.default",
        display: "grid",
        gridTemplateColumns: { md: "1fr 1fr" },
        gap: 16,
      }}
    >
      <Typography variant="h3" component={"h2"} className={classes.fab} >
        {title}
      </Typography>
      <Typography variant="subtitle" component={"p"}>
        {subtitle}
      </Typography>
    </Paper>
  );
};

export default Hero;
