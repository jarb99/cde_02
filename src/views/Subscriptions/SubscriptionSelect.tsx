import * as React from "react";
import { Grid, MenuItem, TextField, Theme, Typography } from "@material-ui/core";
import { formatDate } from "../../formatters/DateFormatters";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import CustomerSubscriptionSummary, { getCustomerSubscriptionKey } from "../../models/CustomerSubscriptionSummary";
import SubscriptionKey, {
  equalsSubscriptionKey,
  parseSubscriptionKey,
  stringifySubscriptionKey
} from "../../models/SubscriptionKey";
import LicenseIcon from "../../components/LicenseIcon";


interface SubscriptionSelectProps {
  label?: React.ReactNode;
  fullWidth?: boolean;
  variant?: 'filled' | 'outlined' | 'standard';
  customerId: number;
  options: CustomerSubscriptionSummary[];
  disabledOptions?: CustomerSubscriptionSummary[];
  value: SubscriptionKey | null;
  error?: boolean;
  helperText?: string;
  onChange: (subscriptionKey: SubscriptionKey) => void;
}

const useSelectStyles = makeStyles((theme: Theme) => ({
  selectMenu: {
    height: "auto"
  }
}));

const useItemStyles = makeStyles((theme: Theme) => ({
  singleLine: {
    paddingTop: theme.spacing(1)
  }
}));

const SubscriptionSelect: React.FC<SubscriptionSelectProps> = (props) => {
  const selectClasses = useSelectStyles();
  const itemClasses = useItemStyles();
  
  const value = props.value != null && props.options.length > 0 ? stringifySubscriptionKey(props.value) : "";

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => 
    props.onChange(parseSubscriptionKey(event.target.value));

  const disabledSubscriptionKeys = 
    (props.disabledOptions || []).map(option => getCustomerSubscriptionKey(option, props.customerId));
  
  const isDisabled = (subscriptionKey: SubscriptionKey) =>
    disabledSubscriptionKeys.some(key => equalsSubscriptionKey(key, subscriptionKey));
  
  return (
    <TextField select 
               SelectProps={{classes: selectClasses}} 
               label={props.label} 
               fullWidth={props.fullWidth} 
               variant={props.variant}
               value={value}
               error={props.error}
               helperText={props.helperText}
               onChange={handleChange}>
      {props.options.map(option => {
        const hasPool = option.pool != null;
        const subscriptionKey = getCustomerSubscriptionKey(option, props.customerId)
        const key = stringifySubscriptionKey(subscriptionKey);

        return (
          <MenuItem key={key} value={key} disabled={isDisabled(subscriptionKey)}>
            <Grid container direction="column">
              {hasPool &&
              <Grid item>
                <Typography variant="h6">{option.pool.name}</Typography>
              </Grid>
              }
              <Grid container item alignItems="center" className={classNames({[itemClasses.singleLine]: !hasPool})} spacing={2}>
                <Grid item xs={4}>
                  {option.product.name}
                </Grid>
                <Grid item xs={4}>
                  <Typography align="right">{formatDate(option.expiryDate)}</Typography>
                </Grid>
                <Grid item xs={4}>
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

export default SubscriptionSelect;
