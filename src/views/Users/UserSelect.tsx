import * as React from "react";
import { IconButton, InputAdornment, TextField, Tooltip } from "@material-ui/core";
import { fieldToTextField, TextFieldProps } from "formik-material-ui";
import UserSummary from "../../models/UserSummary";
import { useState } from "react";
import UserSelectDialog from "./UserSelectDialog";
import SearchIcon from '@material-ui/icons/Search';
import CustomerSummary from "../../models/CustomerSummary";
import { getDomainName } from "./userUtils";

interface UserSelectProps {
  initialUser: UserSummary | null;
  readonly?: boolean;
  customer?: CustomerSummary;
}

const UserSelect: React.FC<UserSelectProps & TextFieldProps> = (props) => {
  const {initialUser, readonly, customer, ...textFieldProps} = props;
  const {
    form: { setFieldValue },
    field: { name },
  } = textFieldProps;

  const [currentUser, setCurrentUser] = useState<UserSummary | null>(initialUser);
  const [changingUser, setChangingUser] = useState<boolean>(false);
  
  const handleSearchClick = () => {
    setChangingUser(true);
  };
  
  const handleUserSelected = (user: UserSummary) => {
    setCurrentUser(user);
    setFieldValue(name, user.id);
    setChangingUser(false);    
  };
  
  const handleUserSelectionCancelled = () => {
    setChangingUser(false);
  };
  
  const getValue = () =>
    currentUser == null 
      ? "" 
      : `${currentUser.firstName} ${currentUser.lastName}`;

  const searchAdornment = !readonly
    ? (
      <InputAdornment position="end">
        <Tooltip title="Search">
          <IconButton
            aria-label="search users"
            onClick={handleSearchClick}>
            <SearchIcon/>
          </IconButton>
        </Tooltip>
      </InputAdornment>
    )
    : null;
  
  return (
    <>
      <TextField {...fieldToTextField(textFieldProps)}
                 value={getValue()} 
                 type="text"
                 InputProps={{
                   endAdornment: searchAdornment
                 }}
                 inputProps={{
                   readOnly: true
                 }}
      />
      <UserSelectDialog open={changingUser} 
                        onSelected={handleUserSelected} 
                        onCancel={handleUserSelectionCancelled} 
                        fixtures={{
                          domainName: getDomainName(customer?.owner?.email)
                        }}/>
    </>
  )
};


export default UserSelect;