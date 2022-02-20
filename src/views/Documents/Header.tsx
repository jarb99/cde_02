import React from "react";
import {
  Theme,
  createStyles,
  makeStyles,
  Grid,
  Box,
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
    <Box 
    display="flex"
    flexDirection="row"
    className={classes.root} 
    style={{
        height: "50px",
        alignItems: "center"
    }}>
      <Grid alignItems="flex-end" container justify="space-between" spacing={3}>
        <Grid item>
          <Typography component="h1" variant="h3">
            {props.title}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Header;
