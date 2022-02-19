import React from "react";
import SearchResult from "../Search/SearchResult";
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import { Grid, IconButton, Theme, Tooltip, Typography } from "@material-ui/core";
import CustomerSummary from "../../models/CustomerSummary";
import { makeStyles } from "@material-ui/core/styles";
import { getFullName } from "../Users/userUtils";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import CustomerLink from "./CustomerLink";

interface CustomerSearchResultProps {
  customer: CustomerSummary;
}

const useStyles = makeStyles((theme: Theme) => ({
  icon: {
    marginBottom: -4,
    color: theme.palette.text.secondary
  },
  badge: {
    marginRight: theme.spacing(1)
  },
  email: {
    wordBreak: "break-word"
  }
}));

const CustomerSearchResult: React.FC<CustomerSearchResultProps> = (props) => {
  const {id, name, country, owner} = props.customer;  
  const classes = useStyles();
  
  return(
    <SearchResult avatar={<AccountBoxIcon/>}>
      <Grid container item xs={12} md direction="row" justify="space-between">
        <Grid container item xs direction="column" justify="flex-start" alignItems="flex-start">
          <Grid item>
            <Typography color="primary">{name}</Typography>
          </Grid>
          <Grid item>
            <Typography color={"textSecondary"}>{country?.name}</Typography>
          </Grid>
        </Grid>
        <Grid container item xs direction="column" alignItems="flex-end">
          <Grid item>
            <Typography color="primary">{getFullName(owner?.firstName, owner?.lastName)}</Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.email} color={"textSecondary"}>{owner?.email}</Typography>
          </Grid>
        </Grid>
        <Grid item>
          <CustomerLink customerId={id}>
            <Tooltip title="Open Customer">
              <IconButton edge="end" aria-label="open customer">
                <OpenInNewIcon/>
              </IconButton>
            </Tooltip>
          </CustomerLink>
        </Grid>
      </Grid>
    </SearchResult>
  );
}

export default CustomerSearchResult;