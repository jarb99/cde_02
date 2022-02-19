import * as React from "react";
import BusinessIcon from '@material-ui/icons/Business';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import { Avatar, makeStyles, Theme, Tooltip } from "@material-ui/core";


const useTooltipStyles = makeStyles((theme: Theme) => ({
  arrow: {
    color: theme.palette.grey[800]
  },
  tooltip: {
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.getContrastText(theme.palette.grey[800])
  }
}));

interface CustomerAvatarProps {
  isReseller?: boolean;
}

const CustomerAvatar: React.FC<CustomerAvatarProps> = (props: CustomerAvatarProps) => {
  const tooltipClasses = useTooltipStyles();
  return (
    <>
      <Tooltip arrow
               classes={tooltipClasses}
               title={props.isReseller === true ? "Reseller" : "Customer"} >
        <Avatar>
          {props.isReseller === true &&
          <SupervisorAccountIcon />
          }
          {!(props.isReseller === true) &&
          <BusinessIcon />
          }
        </Avatar>
      </Tooltip>
    </>
  );
};

export default CustomerAvatar;

