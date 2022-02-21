import React from "react";
import {
  Theme,
  createStyles,
  makeStyles,
  Card,
  CardContent,
  Typography
} from "@material-ui/core";
import FlowRenderer from './FlowRenderer';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3)
    },
    card: {
      margin: theme.spacing(2, 0)
    },
    cardContent: {
      padding: theme.spacing(6)
    },
    content: {
      width: theme.breakpoints.values.md,
      maxWidth: "100%",
      margin: "0 auto",
      padding: theme.spacing(6),
      [theme.breakpoints.up("md")]: {
        padding: theme.spacing(6)
      }
    },
    header: {
      margin: theme.spacing(4)
    },
    body: {
      margin: theme.spacing(4)
    }
  });

const useStyles = makeStyles(styles);

const Details: React.FC = () => {
  const classes = useStyles();
  return (
      <>
        <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
            <div className={classes.content}>
            <Typography align="left" component="h4" variant="h4" >
                Example Workflow #1
            </Typography>
            <FlowRenderer />
            </div>
        </CardContent>
        </Card>
    </>
  );
};

export default Details;
