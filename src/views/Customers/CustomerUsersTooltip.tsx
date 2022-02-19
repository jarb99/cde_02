import * as React from "react";
import { List, ListItem, ListItemAvatar, ListItemText, Theme, Tooltip, TooltipProps } from "@material-ui/core";
import UserAvatar from "../Users/UserAvatar";
import { getFullName } from "../Users/userUtils";
import { makeStyles } from "@material-ui/core/styles";
import CustomerUserSummary from "../../models/CustomerUserSummary";
import UserSummary from "../../models/UserSummary";


interface CustomerUsersTooltipProps extends Omit<TooltipProps, "title"> {
  customerUsers: CustomerUserSummary[]
}

const useStyles = makeStyles((theme: Theme) => ({
  arrow: {
    color: theme.palette.grey[800]
  },
  tooltip: {
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.getContrastText(theme.palette.grey[800])
  },
  textPrimary: {
    color: theme.palette.grey[200]
  },
  textSecondary: {
    color: theme.palette.grey[400]
  }
}));

const CustomerUsersTooltip: React.FC<CustomerUsersTooltipProps> = (props) => {
  const {customerUsers, ...tooltipProps} = props;
  const classes = useStyles();

  const getItemText = (user: UserSummary): { primary: string; secondary?: string; } => {
    if (user.firstName || user.lastName) {
      return {
        primary: getFullName(user.firstName, user.lastName),
        secondary: user.email
      }
    }

    return {primary: user.email};
  };

  const customerUserList = (
    <List>
      {customerUsers.map(customerUser => ({
        key: JSON.stringify(customerUser.user),
        ...getItemText(customerUser.user)
      }))
      .map(user => (
        <ListItem key={user.key}>
          <ListItemAvatar>
            <UserAvatar/>
          </ListItemAvatar>
          <ListItemText classes={{
                          primary: classes.textPrimary, 
                          secondary: classes.textSecondary
                        }}
                        primary={user.primary}
                        secondary={user.secondary}
          />
        </ListItem>
      ))}
    </List>
  );

  return (
    <Tooltip classes={{
                arrow: classes.arrow,
                tooltip: classes.tooltip
             }}
             title={customerUsers.length > 0 ? customerUserList : ""}
             {...tooltipProps}/>
  );
};

export default CustomerUsersTooltip;
