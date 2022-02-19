import React, { ReactNode } from "react";
import { Avatar, createStyles, Grid, makeStyles, Theme, useMediaQuery, useTheme } from "@material-ui/core";


interface SearchResultProps {
  avatar: ReactNode;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {},
  content: {
    padding: theme.spacing(2)
  },
  avatar: {
    flex: "0 0 auto"
  },
  email: {
    wordBreak: "break-word"
  }
}));

const SearchResult: React.FC<SearchResultProps> = (props) => {
  const {avatar, children} = props;

  const classes = useStyles();
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));
  const spacing = 1;

  return (
    <Grid container direction="row" justify="space-between" alignItems="flex-start" spacing={spacing}>
      {mdUp &&
      <Grid item className={classes.avatar} md={1}>
        <Avatar>{avatar}</Avatar>
      </Grid>
      }
      <Grid container item xs md={11} spacing={spacing}>
        {children}
      </Grid>
    </Grid>
  );
};

export default SearchResult;