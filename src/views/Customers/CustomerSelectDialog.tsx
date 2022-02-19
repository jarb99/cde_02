import React, { useState } from "react";
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import FormActions from "../../components/FormActions";
import { Dialog, DialogActions, DialogContent, useMediaQuery, useTheme } from "@material-ui/core";
import DialogHeader from "../../components/DialogHeader";
import CustomerSummary from "../../models/CustomerSummary";
import CustomerSearch from "./CustomerSearch";
import { FastSearchFixtures } from "../Search/Search";


interface CustomerSelectDialogProps {
  open: boolean;
  onSelected: (user: CustomerSummary) => void;
  onCancel: () => void;
  fixtures?: FastSearchFixtures;
}

const CustomerSelectDialog: React.FC<CustomerSelectDialogProps> = (props: CustomerSelectDialogProps) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const [selectedCustomer, setSelectedCustomer] = useState<CustomerSummary | null>(null);

  const handleSubmit = () => {
    props.onSelected(selectedCustomer!);
  };

  return (
    <Dialog fullWidth={true}
            onClose={props.onCancel}
            open={props.open}
            fullScreen={smDown}
    >
      <DialogHeader title="Choose Customer"
                    avatar={<AccountBoxIcon/>}
                    onClose={props.onCancel}/>

      <DialogContent>
        <CustomerSearch selectedCustomer={selectedCustomer}
                        onSelectionChanged={setSelectedCustomer}
                        fixtures={props.fixtures}/>
      </DialogContent>

      <DialogActions>
        <FormActions submitDisabled={selectedCustomer == null}
                     submitText="Ok"
                     onSubmit={handleSubmit}
                     onCancel={props.onCancel}
        />
      </DialogActions>
    </Dialog>
  );

};

export default CustomerSelectDialog;