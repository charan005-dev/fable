import { Paper, Typography } from "@material-ui/core";
import React from "react";

const Hero = ({ title, subtitle }) => {
  return (
    <Paper
      elevation={10}
      sx={{
        bgcolor: "background.default",
        display: "grid",
        gridTemplateColumns: { md: "1fr 1fr" },
        gap: 2,
      }}
    >
      <Typography variant="h2" component={"h1"}>
        {title}
      </Typography>
      <Typography variant="subtitle" component={"p"}>
        {subtitle}
      </Typography>
    </Paper>
  );
};

export default Hero;
