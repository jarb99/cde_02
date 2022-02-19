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
import { getFullName } from "../Users/userUtils";
import clsx from "clsx";
import CustomerAvatar from "../Customers/CustomerAvatar";


interface ContactSearchResultProps {
  contactId: string;
  contactName: string;
  location: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
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

const ContactSearchResult: React.FC<ContactSearchResultProps> = (props) => {
  const {
    contactName,
    location,
    firstName,
    lastName,
    emailAddress
  } = props;

  const name = getFullName(firstName, lastName);

  const classes = useStyles();
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));
  const spacing = 1;

  return (
    <Box width={1} className="ContactSearchResult-root">
      <Paper className={clsx(classes.content, "ContactSearchResult-content")}>
        <Grid container direction="row" justify="space-between" alignItems="flex-start" spacing={spacing}>
          {mdUp &&
          <Grid item className={classes.avatar} md={1}>
            <CustomerAvatar />
          </Grid>
          }
          <Grid container item xs md={11} spacing={spacing}>
            <Grid container item xs={12} md direction="column" justify="flex-start" alignItems="flex-start">
              <Grid item>
                <Typography color="primary">{contactName}</Typography>
              </Grid>
              <Grid item>
                <Typography color={"textSecondary"}>{location}</Typography>
              </Grid>
            </Grid>
            <Grid container item xs={12} md direction="column" justify="flex-start" alignItems="flex-start">
              <Grid item>
                <Typography>{name}</Typography>
              </Grid>
              <Grid item>
                <Typography  color={"textSecondary"} className={classes.email}>{emailAddress}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ContactSearchResult;