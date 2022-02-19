import React from "react";
import {
  Theme,
  createStyles,
  makeStyles,
  Grid,
  Typography
} from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    root: {}
  });

const useStyles = makeStyles(styles);

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid alignItems="flex-end" container justify="space-between" spacing={3}>
        <Grid item>
          <Typography component="h1" variant="h3">
            {props.title}
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default Header;
