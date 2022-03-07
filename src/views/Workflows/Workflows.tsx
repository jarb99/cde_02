import React, { useEffect, useState, useReducer } from "react";
import ProjectNavBar from "../../layouts/Dashboard/ProjectNavBar";
import { Box, Button, Container, createStyles, makeStyles, TableCell, Theme, Typography, Card, CardContent } from "@material-ui/core";
import Page from "../../components/Page";
import Details from "./Details";
import Workflow from './Workflow';
import { useApiFetch } from "../../api/ApiFetch";


const styles = (theme: Theme) =>
  createStyles({
    root: {
      // paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
    },
    card: {
      margin: theme.spacing(2, 0)
    },
    cardContent: {
      padding: theme.spacing(6),
      marginBottom: "30px"
    },
    content: {
      width: theme.breakpoints.values.md,
      maxWidth: "400px",
      margin: "10 auto",
      padding: theme.spacing(6),
      [theme.breakpoints.up("md")]: {
        padding: theme.spacing(6)
      }
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

const Workflows = (props: Props) => {


   const classes = useStyles();
   return (
      <Page className={classes.root} title="Users">
         <Box
            display="flex"
            flexDirection="column"
            style={{
               width: "100%",
               height: "calc(100% - 15px)",
            }}
         >
            <ProjectNavBar title={"WORKFLOWS"} />
            <Box
               style={{
                  height: "400px",
                  flexGrow: 1,
                  width: "100%",
               }}
            >
               <Container maxWidth={"md"}>

                  <Card className={classes.card}>
                     <CardContent className={classes.cardContent}>
                        <Workflow workflowId={'1'} title={'Default workflow'}/>
                     </CardContent>
                  </Card>
                  <Card className={classes.card}>
                     <CardContent className={classes.cardContent}>
                        <Workflow workflowId={'2'} title={'Default with technical review'}/>
                     </CardContent>
                  </Card>
                  <Card className={classes.card}>
                     <CardContent className={classes.cardContent}>
                        <Workflow workflowId={'3'} title={'Complex workflow'}/>
                     </CardContent>
                  </Card>
                  {/* NEW APPROACH... */}
               </Container>
            </Box>
         </Box>
      </Page>
   )
}

export default Workflows;
