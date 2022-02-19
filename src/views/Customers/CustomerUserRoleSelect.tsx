import * as React from "react";
import { MenuItem, TextField } from "@material-ui/core";
import CustomerUserRole from "../../models/CustomerUserRole";
import { fieldToTextField, TextFieldProps } from "formik-material-ui";


interface CustomerUserRoleSelectProps extends TextFieldProps {
  allowOwnerSelection?: boolean;
}

const CustomerUserRoleSelect: React.FC<CustomerUserRoleSelectProps> = (props) => {
  const {allowOwnerSelection, ...textFieldProps} = props;
  
  return (
    <TextField {...fieldToTextField(textFieldProps)} select>
      <MenuItem key={CustomerUserRole.Owner} value={CustomerUserRole.Owner} disabled={allowOwnerSelection === false}>{CustomerUserRole.Owner}</MenuItem>
      <MenuItem key={CustomerUserRole.Admin} value={CustomerUserRole.Admin}>{CustomerUserRole.Admin}</MenuItem>
      <MenuItem key={CustomerUserRole.User} value={CustomerUserRole.User}>{CustomerUserRole.User}</MenuItem>
    </TextField>
  );
};

export default CustomerUserRoleSelect;