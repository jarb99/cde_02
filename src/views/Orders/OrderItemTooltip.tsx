import * as React from "react";
import { Grid, Theme, Tooltip, TooltipProps, Typography } from "@material-ui/core";
import classNames from "classnames";
import { formatDate } from "../../formatters/DateFormatters";
import OrderItemTypeChip from "./OrderItemTypeChip";
import LicenseIcon from "../../components/LicenseIcon";
import { makeStyles } from "@material-ui/core/styles";
import OrderDetailItem from "../../models/OrderDetailItem";
import Correlatable from "../../models/Correlatable";


interface OrderItemTooltipProps extends Omit<TooltipProps, "title"> {
  item: OrderDetailItem & Correlatable | null;
}

const useStyles = makeStyles((theme: Theme) =>({
  arrow: {
    color: theme.palette.grey[800]
  },
  container: {
    width: theme.breakpoints.values.sm,
    padding: theme.spacing(2)
  },
  tooltip: {
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.getContrastText(theme.palette.grey[800]),
    maxWidth: theme.breakpoints.values.sm
  },
  singleLine: {
    paddingTop: theme.spacing(1)
  },
  colorTextPrimary: {
    color: theme.palette.grey[200]
  },
  colorTextSecondary: {
    color: theme.palette.grey[400]
  }
}));

const OrderItemTooltip: React.FC<OrderItemTooltipProps> = (props) => {
  const {item, ...tooltipProps} = props;
  const classes = useStyles();
  const hasPool = item?.subscriptionPool != null;
  
  const typographyClasses = {
    colorTextPrimary: classes.colorTextPrimary,
    colorTextSecondary: classes.colorTextSecondary
  }

  const tooltipContent =
    item != null
      ? (
        <div className={classes.container}>
          <Grid container direction="column">
            {hasPool &&
            <Grid item>
              <Typography classes={typographyClasses} 
                          color="textPrimary" 
                          variant="h6">
                {item.subscriptionPool?.name}
              </Typography>
            </Grid>
            }
            <Grid container alignItems="center" className={classNames({[classes.singleLine]: !hasPool})} spacing={2}>
              <Grid item xs={1}>
                <Typography classes={typographyClasses}
                            color="textPrimary"
                            align="right">
                  {item.correlationId}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography classes={typographyClasses}
                            color="textPrimary">
                  {item.product.name}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography classes={typographyClasses}
                            color="textPrimary"
                            align="right">
                  {item.expiryDate != null ? formatDate(item.expiryDate ?? null) : "Default"}</Typography>
              </Grid>
              <Grid container item xs={3} justify="center">
                <Grid item>
                  <OrderItemTypeChip itemType={item.type}/>
                </Grid>
              </Grid>
              <Grid item xs={2}>
                <Typography classes={typographyClasses}
                            color="textPrimary"            
                            align="center">
                  <LicenseIcon licenseType={item.licenseType} quantity={item.quantity}/>
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </div>)
      : ""; 
  
  return (
    <Tooltip classes={{arrow: classes.arrow, tooltip: classes.tooltip}} title={tooltipContent} {...tooltipProps}/>
  );
};

export default OrderItemTooltip;