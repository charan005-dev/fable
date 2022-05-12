import {
  Badge,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Fab,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";
import React from "react";
import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../firebase/Auth";
import Hero from "../Hero";
import axios from "axios";
import { makeStyles } from "@material-ui/styles";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Add from "@mui/icons-material/Add";
import { Stack } from "@mui/material";

const useStyles = makeStyles({
  card1: {
    width: "30%",
    paddingLeft: "300px",
  },
  card: {
    width: "auto",
    minWidth: "600px",
    marginLeft: "100%",
    paddingLeft: "0%",
  },
  card2: {
    marginLeft: "0px",
  },
  card3: {
    width: "700%",
  },
  card4: {
    paddingRight: "3%",
    width: "100%",
  },
  card5: {
    width: "100%",
  },
  edit: {
    paddingLeft: "70%",
  },
  create: {
    marginLeft: "50%",
    height: "35px",
    borderRadius: "0px",
  },
  create1: {
    marginLeft: "50%",
    height: "auto",
    width: "60%",
    maxWidth: "100%",
    borderRadius: "0px",
  },
  paper: { width: "80%", marginRight: "10%", paddingRight: "20%", paddingLeft: "0%", position: "absolute" },
});

const ViewLibrariesList = () => {
  const [libraryData, setLibraryData] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const classes = useStyles();

  useEffect(() => {
    async function getOwnerLibraries() {
      const { data } = await axios.get(`/api/libraries/me?owner=${currentUser.uid}`, {
        headers: { authtoken: await currentUser.getIdToken() },
      });
      console.log(data);
      setLibraryData(data.libraries);
    }
    getOwnerLibraries();
  }, []);

  return (
    <div>
      {/* <Hero title={""} /> */}
      <br />
      <br />

      <div className={classes.libTitle}>
        <Typography variant="h2">Library</Typography>
      </div>
      <Divider />
      <br />
      <br />
      <Paper
        elevation={0}
        className={classes.paper}
        sx={{
          bgcolor: "background.default",
          display: "grid",
          gridTemplateColumns: { md: "1fr 1fr" },
          gap: 2,
          height: "auto",
        }}
      >
        <Stack direction={"column"} spacing={2}>
          <Card className={classes.card2} elevation={0}>
            <Fab
              className={classes.create}
              color="primary"
              variant="extended"
              onClick={() => navigate(`/libraries/create`)}
            >
              <Add />
              Create a new library
            </Fab>
          </Card>
        </Stack>
        <br />

        <Stack direction={"column"} spacing={2}>
          {libraryData &&
            libraryData.length > 0 &&
            libraryData.map((lib) => {
              return (
                <div>
                  <span>
                    <Card className={classes.create1} elevation={5}>
                      <CardContent>
                        <Stack spacing={0} direction={"row"}>
                          <Card className={classes.card3} elevation={0}>
                            <Badge
                              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                              badgeContent={lib.stories.length === 0 ? "0" : lib.stories.length}
                            >
                              <LibraryBooksIcon />
                            </Badge>
                            <Link to={`/libraries/${lib._id}`}>
                              <Typography variant="body2">
                                {lib.libraryName.length > 20
                                  ? lib.libraryName.length.substring(16) + "..."
                                  : lib.libraryName}
                              </Typography>
                            </Link>
                          </Card>
                          {/* <Card className={classes.card4} elevation={0}>
                            <Badge className={classes.edit}>
                              <EditIcon />
                            </Badge>
                          </Card>
                          <Card className={classes.card5} elevation={0}>
                            <Badge className={classes.delete}>
                              <DeleteIcon />
                            </Badge>
                          </Card> */}
                        </Stack>
                        <Stack spacing={2} direction={"row"}></Stack>
                        {/* </Stack> */}
                      </CardContent>
                    </Card>
                  </span>
                </div>
              );
            })}
          {libraryData && libraryData.length === 0 && (
            <div>
              Seems like you're missing out on so much fun! <Link to={`/libraries/create`}>Click here</Link> to create
              your own library, make it public and much more!
            </div>
          )}
        </Stack>

        <br />
      </Paper>
    </div>
  );
};

export default ViewLibrariesList;
