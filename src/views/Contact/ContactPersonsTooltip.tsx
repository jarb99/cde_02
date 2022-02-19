import * as React from "react";
import ContactPerson from "../../models/ContactPerson";
import { List, ListItem, ListItemAvatar, ListItemText, Theme, Tooltip, TooltipProps } from "@material-ui/core";
import UserAvatar from "../Users/UserAvatar";
import { getFullName } from "../Users/userUtils";
import { makeStyles } from "@material-ui/core/styles";


interface ContactPersonsTooltipProps extends Omit<TooltipProps, "title"> {
  contactPersons: ContactPerson[]
}

const useTooltipStyles = makeStyles((theme: Theme) => ({
  arrow: {
    color: theme.palette.grey[800]
  },
  tooltip: {
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.getContrastText(theme.palette.grey[800])
  }
}));

const useListItemTextStyles = makeStyles((theme: Theme) => ({
  primary: {
    color: theme.palette.grey[200]
  },
  secondary: {
    color: theme.palette.grey[400]
  }
}));

const ContactPersonsTooltip: React.FC<ContactPersonsTooltipProps> = (props) => {
  const {contactPersons, ...tooltipProps} = props;
  const tooltipClasses = useTooltipStyles();
  const listItemTextClasses = useListItemTextStyles();

  const getItemText = (contactPerson: ContactPerson): { primary: string; secondary?: string; } => {
    if (contactPerson.firstName || contactPerson.lastName) {
      return {
        primary: getFullName(contactPerson.firstName, contactPerson.lastName),
        secondary: contactPerson.emailAddress
      }
    }

    return {primary: contactPerson.emailAddress};
  };

  const contactPersonsList = (
    <List>
      {contactPersons.map(contactPerson => ({
        key: JSON.stringify(contactPerson),
        ...getItemText(contactPerson)
      }))
      .map(contactPerson => (
        <ListItem key={contactPerson.key}>
          <ListItemAvatar>
            <UserAvatar/>
          </ListItemAvatar>
          <ListItemText classes={listItemTextClasses}
                        primary={contactPerson.primary}
                        secondary={contactPerson.secondary}
          />
        </ListItem>
      ))}
    </List>
  );

  return (
    <Tooltip classes={tooltipClasses} title={contactPersons.length > 0 ? contactPersonsList : ""} {...tooltipProps}/>
  );
};

export default ContactPersonsTooltip;
