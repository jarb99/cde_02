import * as React from "react";
import { useEffect, useState } from "react";
import PaymentMethod from "../../models/PaymentMethod";
import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormLabel, Grid,
  Radio,
  RadioGroup, Theme
} from "@material-ui/core";
import DialogHeader from "../../components/DialogHeader";
import PaymentIcon from '@material-ui/icons/Payment';
import FormActions from "../../components/FormActions";
import { makeStyles } from "@material-ui/core/styles";

interface OrderPaymentDialogProps {
  paymentMethod: PaymentMethod | null;
  open: boolean;
  disabled: boolean;
  showProgress: boolean;
  onCancel: () => void;
  onSave: (paymentMethod: PaymentMethod, executeFulfillment: boolean) => void;
  errorComponent: React.ReactNode | null;
}

const useStyles = makeStyles((theme: Theme) => ({
  contentRoot: {
    paddingTop: theme.spacing(3)
  }
}));

const OrderPaymentDialog: React.FC<OrderPaymentDialogProps> = (props) => {
  const styles = useStyles();
  
  const [method, setMethod] = useState<PaymentMethod | null>(props.paymentMethod);
  const [executeFulfillment, setExecuteFulfillment] = useState<boolean>(true);
  
  useEffect(() => {
    setMethod(props.paymentMethod);
  }, [props.paymentMethod]);

  const handleMethodChange = (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    setMethod(value as PaymentMethod);
  }

  const handleExecuteFulfillmentChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setExecuteFulfillment(checked);
  }
  
  const handleSubmit = () => {
    props.onSave(method!, executeFulfillment);
  };

  return (
    <Dialog fullWidth={false}
            open={props.open}
            onClose={props.onCancel}>
      <DialogHeader title="Add Payment"
                    avatar={<PaymentIcon/>}
                    onClose={props.onCancel} 
                    disableClose={props.disabled}
                    showProgress={props.showProgress}/>
      <DialogContent className={styles.contentRoot}>
        {props.errorComponent}
        {props.errorComponent == null &&
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <FormControl component="fieldset" disabled={props.disabled}>
              <FormLabel component="legend">Payment Method</FormLabel>
              <RadioGroup aria-label="payment method" name="paymentMethod" value={method} onChange={handleMethodChange}>
                <FormControlLabel value={PaymentMethod.SecurePay.toString()} control={<Radio/>} label="SecurePay"/>
                <FormControlLabel value={PaymentMethod.PayPal.toString()} control={<Radio/>} label="PayPal"/>
                <FormControlLabel value={PaymentMethod.Stripe.toString()} control={<Radio/>} label="Stripe"/>
                <FormControlLabel value={PaymentMethod.BankDeposit.toString()} control={<Radio/>} label="Bank Deposit"/>
                <FormControlLabel value={PaymentMethod.Bundled.toString()} control={<Radio/>} label="Bundled"/>
                <FormControlLabel value={PaymentMethod.Cheque.toString()} control={<Radio/>} label="Cheque"/>
                <FormControlLabel value={PaymentMethod.Other.toString()} control={<Radio/>} label="Other"/>
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControlLabel control={
              <Checkbox name="fulfil"
                        checked={executeFulfillment}
                        onChange={handleExecuteFulfillmentChange}
                        disabled={props.disabled}/>}
                              label="Execute fulfillment"/>
          </Grid>
        </Grid>
        }
      </DialogContent>
      <DialogActions>
        <FormActions disabled={props.disabled}
                     submitText="Save"
                     onSubmit={handleSubmit}
                     submitDisabled={method == null || method === PaymentMethod.None || props.errorComponent != null}
                     onCancel={props.onCancel}/>
      </DialogActions>
    </Dialog>
  );
};

export default OrderPaymentDialog;

