import * as React from "react";
import OrderDetailItem from "../../models/OrderDetailItem";
import { Grid, MenuItem, TextField, Theme, Typography } from "@material-ui/core";
import Correlatable from "../../models/Correlatable";
import LicenseIcon from "../../components/LicenseIcon";
import OrderItemTypeChip from "./OrderItemTypeChip";
import { makeStyles } from "@material-ui/core/styles";
import { formatDate } from "../../formatters/DateFormatters";
import classNames from "classnames";


interface OrderItemSelectProps {
  label?: React.ReactNode;
  fullWidth?: boolean;
  variant?: 'filled' | 'outlined' | 'standard';
  options: (OrderDetailItem & Correlatable)[];
  disabledOptions?: (OrderDetailItem & Correlatable)[];
  value: OrderDetailItem & Correlatable | null;
  error?: boolean;
  helperText?: string;
  onChange: (item: OrderDetailItem & Correlatable) => void;
}

const useStyles = makeStyles((theme: Theme) =>({
  singleLine: {
    paddingTop: theme.spacing(1)
  }
}));

const OrderItemSelect: React.FC<OrderItemSelectProps> = (props) => {
  const classes = useStyles();
    
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    props.onChange(props.options.find(option => option.correlationId === parseInt(event.target.value))!);
  
  const isDisabled = (correlationId: number) => 
    props.disabledOptions == null
      ? false
      : props.disabledOptions.some(option => option.correlationId === correlationId);
  
  return (
    <TextField select
               label={props.label}
               fullWidth={props.fullWidth}
               variant={props.variant}
               value={props.value?.correlationId ?? ""}
               error={props.error}
               helperText={props.helperText}
               onChange={handleChange}>
      {props.options.map(option => {
        const hasPool = option.subscriptionPool != null;
        const key = option.correlationId;
                  
        return (
          <MenuItem key={key} value={key} disabled={isDisabled(key)}>
            <Grid container direction="column">
              {hasPool &&
              <Grid item>
                <Typography variant="h6">{option.subscriptionPool?.name}</Typography>
              </Grid>
              }
              <Grid container alignItems="center" className={classNames({[classes.singleLine]: !hasPool})} spacing={2}>
                <Grid item xs={1}>
                  <Typography align="right">{option.correlationId}</Typography>
                </Grid>
                <Grid item xs={3}>
                  {option.product.name}
                </Grid>
                <Grid item xs={3}>
                  <Typography align="right">{option.expiryDate != null ? formatDate(option.expiryDate ?? null) : "Default"}</Typography>
                </Grid>
                <Grid container item xs={3} justify="center">
                  <Grid item>
                    <OrderItemTypeChip itemType={option.type}/>
                  </Grid>
                </Grid>
                <Grid item xs={2}>
                  <Typography align="center">
                    <LicenseIcon licenseType={option.licenseType} quantity={option.quantity}/>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </MenuItem>
        );
      })}
    </TextField>
  );
};


export default OrderItemSelect;