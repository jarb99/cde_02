import React, { useState } from "react";
import FormActions from "../../components/FormActions";
import { Dialog, DialogActions, DialogContent, useMediaQuery, useTheme } from "@material-ui/core";
import { FastSearchFixtures } from "./ContactSearch";
import DialogHeader from "../../components/DialogHeader";
import ContactSearch, { SelectedContact } from "./ContactSearch";
import ContactSummary from "../../models/ContactSummary";
import XeroAvatar from "../../components/XeroAvatar";


interface ContactSelectDialogProps {
  open: boolean;
  saving?: boolean;
  disabled?: boolean;
  errorMessage?: string;
  onCancel: () => void;
  onSave: (contact: ContactSummary) => void;
  fixtures?: FastSearchFixtures;
}

const ContactSelectDialog: React.FC<ContactSelectDialogProps> = (props: ContactSelectDialogProps) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedContact, setSelectedContact] = useState<SelectedContact>(null);

  const disabled = props.disabled || props.saving;

  const handleSubmit = () => {
    props.onSave(selectedContact!);   
  };
  
  return (
    <Dialog fullWidth={true}
            onClose={props.onCancel}
            open={props.open}
            fullScreen={smDown}
    >
      <DialogHeader title="Choose Contact"
                    avatar={<XeroAvatar/>}
                    onClose={props.onCancel}
                    showProgress={props.saving} />

      <DialogContent>
        <ContactSearch disabled={disabled}
                       selectedContact={selectedContact}
                       onSelectionChanged={setSelectedContact}
                       fixtures={props.fixtures}/>
      </DialogContent>

      <DialogActions>
        <FormActions disabled={disabled}
                     submitDisabled={selectedContact == null}
                     submitErrorMessage={props.errorMessage}
                     onSubmit={handleSubmit}
                     onCancel={props.onCancel}
        />
      </DialogActions>
    </Dialog>
  );
};

export default ContactSelectDialog;