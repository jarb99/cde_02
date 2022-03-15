import React, { useEffect, useState, useReducer, useContext } from "react";
import { ActionType } from './documentsReducer';
import { DispatchContext, StateContext } from './Documents';
import {
  Box,
  Button,
  Container,
  createStyles,
  makeStyles,
  TableCell,
  Theme,
  Typography,
  Card,
  CardContent,
} from "@material-ui/core";
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { useApiFetch } from "../../api/ApiFetch";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      // paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
    },
    container: {
      paddingLeft: "10px"
    },
    card: {
      margin: theme.spacing(2, 0),
    },
    cardContent: {
      padding: theme.spacing(6),
      marginBottom: "30px",
    },
    content: {
      width: theme.breakpoints.values.md,
      maxWidth: "400px",
      margin: "10 auto",

      padding: theme.spacing(6),
      [theme.breakpoints.up("md")]: {
        padding: theme.spacing(6),
      },
    },
    results: {
      marginTop: theme.spacing(3),
    },
    search: {
      flexGrow: 1,
      maxWidth: 480,
      flexBasis: 480,
      margin: theme.spacing(0, 2),
    },
  });

const useStyles = makeStyles(styles);

interface Props {
}

const Sidebar = (props: Props) => {
  const classes = useStyles();
  const { dispatch } = useContext(DispatchContext);
  const { state } = useContext(StateContext);

  return (
    <>
      <Box display={"flex"} flexDirection={"row"} style={{ height: "100%" }}>
        <Box
          // display={"flex"}
          // alignItems={"center"}
          // style={{ height: "100%", width: "30px" }}
        >
        <Button
          style={{maxWidth: '20px', minWidth: '20px', height: "100%"}}
          onClick={() => dispatch({ type: ActionType.expandClick })}
        >
          <ChevronLeftIcon style={{padding: "0px"}}/>
        </Button>
        </Box>
        <Box
          flexGrow={1}
          style={{
            height: "100%",
          }}
        >
          <Container maxWidth={"md"} className={classes.container}>
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                PDF PREVIEW
              </CardContent>
            </Card>
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                WORKFLOW
              </CardContent>
            </Card>
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                DOCUMENT PROPERTIES
              </CardContent>
            </Card>
            {/* NEW APPROACH... */}
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default Sidebar;
