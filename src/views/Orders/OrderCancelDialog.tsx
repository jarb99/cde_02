import * as React from "react";
import { useState } from "react";
import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControlLabel,
  Grid,
  Theme
} from "@material-ui/core";
import DialogHeader from "../../components/DialogHeader";
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import FormActions from "../../components/FormActions";
import { makeStyles } from "@material-ui/core/styles";

interface OrderCancelDialogProps {
  open: boolean;
  disabled: boolean;
  showProgress: boolean;
  onCancel: () => void;
  onSave: (creditInvoices: boolean) => void;
  errorComponent: React.ReactNode | null;
}

const useStyles = makeStyles((theme: Theme) => ({
  contentRoot: {
    paddingTop: theme.spacing(3)
  }
}));

const OrderCancelDialog: React.FC<OrderCancelDialogProps> = (props) => {
  const styles = useStyles();
  
  const [creditInvoices, setCreditInvoices] = useState<boolean>(true);

  const handleCreditInvoicesChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setCreditInvoices(checked);
  }
  
  const handleSubmit = () => {
    props.onSave(creditInvoices);
  };

  return (
    <Dialog fullWidth={false}
            open={props.open}
            onClose={props.onCancel}>
      <DialogHeader title="Cancel Order"
                    avatar={<DeleteOutlineIcon/>}
                    onClose={props.onCancel} 
                    disableClose={props.disabled}
                    showProgress={props.showProgress}/>
      <DialogContent className={styles.contentRoot}>
        {props.errorComponent}
        {props.errorComponent == null &&
        <>
        <DialogContentText>
            Are you sure you want to cancel this order?
        </DialogContentText>
        <Grid container spacing={1}>
          <Grid item>
            <FormControlLabel control={
              <Checkbox name="creditInvoices"
                        checked={creditInvoices}
                        onChange={handleCreditInvoicesChange}
                        disabled={props.disabled}/>}
                        label="Credit invoices"/>
          </Grid>
        </Grid>
        </>
        }
      </DialogContent>
      <DialogActions>
        <FormActions disabled={props.disabled}
                     submitText="Yes"
                     onSubmit={handleSubmit}
                     submitDisabled={props.errorComponent != null}
                     onCancel={props.onCancel}/>
      </DialogActions>
    </Dialog>
  );
};

export default OrderCancelDialog;
