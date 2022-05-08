import { Badge, Card, CardActionArea, CardContent, Fab, Grid, Typography } from "@material-ui/core";
import React from "react";
import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../firebase/Auth";
import Hero from "../Hero";
import axios from "axios";
import { makeStyles } from "@material-ui/styles";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import Add from "@mui/icons-material/Add";
import { Stack } from "@mui/material";

const useStyles = makeStyles({
  card1: {
    width: "30%",
    paddingLeft: "300px",
  },
});

const ViewLibrariesList = () => {
  const [libraryData, setLibraryData] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const classes = useStyles();

  useEffect(() => {
    async function getOwnerLibraries() {
      const { data } = await axios.get(`/api/libraries/me?owner=${currentUser.uid}`);
      console.log(data);
      setLibraryData(data.libraries);
    }
    getOwnerLibraries();
  }, []);

  return (
    <div>
      <Hero title={""} />
      <Fab color="primary" variant="extended" onClick={() => navigate(`/libraries/create`)}>
        <Add />
        Create a new library
      </Fab>
      <Grid container justifyContent="center">
        {libraryData &&
          libraryData.length > 0 &&
          libraryData.map((lib) => {
            return (
              <Card>
                <CardContent>
                  <CardActionArea>
                    <Stack spacing={2} direction={"row"}>
                      <Badge
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        badgeContent={lib.stories.length === 0 ? "0" : lib.stories.length}
                      >
                        <LibraryBooksIcon />
                      </Badge>
                      <Link to={`/libraries/${lib._id}`}>
                        <Typography variant="body2">
                          {lib.libraryName.length > 20 ? lib.libraryName.length.substring(16) + "..." : lib.libraryName}
                        </Typography>
                      </Link>
                    </Stack>
                  </CardActionArea>
                </CardContent>
              </Card>
            );
          })}
        {libraryData && libraryData.length === 0 && (
          <div>
            Seems like you're missing out on so much fun! <Link to={`/libraries/create`}>Click here</Link> to create
            your own library, make it public and much more!
          </div>
        )}
      </Grid>
    </div>
  );
};

export default ViewLibrariesList;
