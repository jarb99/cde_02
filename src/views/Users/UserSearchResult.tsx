import React from "react";
import {
  Box,
  createStyles,
  Grid,
  makeStyles,
  Paper,
  Theme,
  Typography,
  useMediaQuery,
  useTheme
} from "@material-ui/core";
import { getFullName } from "./userUtils";
import clsx from "clsx";
import UserAvatar from "./UserAvatar";


interface UserSearchResultProps {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
/*  companyName: string;
  countryName: string;*/
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

const UserSearchResult: React.FC<UserSearchResultProps> = (props) => {
  const {
    firstName,
    lastName,
    email,
/*    companyName,
    countryName*/
  } = props;

  const name = getFullName(firstName, lastName);

  const classes = useStyles();
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));
  const spacing = 1;

  return (
    <Box width={1} className="UserSearchResult-root">
      <Paper className={clsx(classes.content, "UserSearchResult-content")}>
        <Grid container direction="row" justify="space-between" alignItems="flex-start" spacing={spacing}>
          {mdUp &&
          <Grid item className={classes.avatar} md={1}>
            <UserAvatar/>
          </Grid>
          }
          <Grid container item xs md={11} spacing={spacing}>
            <Grid container item xs={12} md direction="column" justify="flex-start" alignItems="flex-start">
              <Grid item>
                <Typography color="primary">{name}</Typography>
              </Grid>
              <Grid item>
                <Typography className={classes.email}>{email}</Typography>
              </Grid>
            </Grid>
            {/*<Grid container item xs={12} md direction="column" justify="flex-start" alignItems="flex-start">
              <Grid item>
                <Typography><strong>{companyName}</strong></Typography>
              </Grid>
              <Grid item>
                <Typography color={"textSecondary"}>{countryName}</Typography>
              </Grid>
            </Grid>*/}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default UserSearchResult;