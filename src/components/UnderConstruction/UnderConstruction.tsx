import React from "react";
import {
  Theme,
  createStyles,
  makeStyles,
  Container,
  Divider
} from "@material-ui/core";
import Page from "../Page";
import Header from "./Header";
import Details from "./Details";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3)
    },
    divider: {
      margin: theme.spacing(2, 0)
    }
  });

const useStyles = makeStyles(styles);

interface UnderConstructionProps {
  title: string;
}

const UnderConstruction: React.FC<UnderConstructionProps> = (
  props: UnderConstructionProps
) => {
  const classes = useStyles();
  return (
    <Page
      className={classes.root}
      title={`${props.title} | Under Construction`}
    >
      <Container maxWidth="lg">
        <Header title={props.title} />
        <Divider className={classes.divider} />
        <Details />
      </Container>
    </Page>
  );
};

export default UnderConstruction;
