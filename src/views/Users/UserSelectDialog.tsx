import React, { useState } from "react";
import PersonIcon from "@material-ui/icons/Person";
import FormActions from "../../components/FormActions";
import { Dialog, DialogActions, DialogContent, useMediaQuery, useTheme } from "@material-ui/core";
import UserSearch, { FastSearchFixtures, SelectedUser } from "./UserSearch";
import UserSummary from "../../models/UserSummary";
import DialogHeader from "../../components/DialogHeader";


interface UserSelectDialogProps {
  open: boolean;
  onSelected: (user: UserSummary) => void;
  onCancel: () => void;
  customerId?: number;
  fixtures?: FastSearchFixtures;
}

const UserSelectDialog: React.FC<UserSelectDialogProps> = (props: UserSelectDialogProps) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const [selectedUser, setSelectedUser] = useState<SelectedUser>(null);

  const handleSubmit = () => {
    props.onSelected(selectedUser!);
  };

  return (
    <Dialog fullWidth={true}
            onClose={props.onCancel}
            open={props.open}
            fullScreen={smDown}
    >
      <DialogHeader title="Choose User"
                    avatar={<PersonIcon/>}
                    onClose={props.onCancel} />

      <DialogContent>
        <UserSearch selectedUser={selectedUser}
                    onSelectionChanged={setSelectedUser}
                    customerId={props.customerId}
                    fixtures={props.fixtures}/>
      </DialogContent>

      <DialogActions>
        <FormActions submitDisabled={selectedUser == null}
                     submitText="Ok"
                     onSubmit={handleSubmit}
                     onCancel={props.onCancel}
        />
      </DialogActions>
    </Dialog>
  );

};

export default UserSelectDialog;