import * as React from "react";
import { useState } from "react";
import CustomerSummary from "../../models/CustomerSummary";
import { fieldToTextField, TextFieldProps } from "formik-material-ui";
import { IconButton, InputAdornment, TextField, Tooltip } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import CustomerSelectDialog from "../Customers/CustomerSelectDialog";
import { getDomainName } from "./userUtils";
import UserSummary from "../../models/UserSummary";


interface CustomerSelectProps {
  initialCustomer: CustomerSummary | null;
  readonly?: boolean;
  user?: UserSummary;
}

const CustomerSelect: React.FC<CustomerSelectProps & TextFieldProps> = (props) => {
  const {initialCustomer, readonly, user, ...textFieldProps} = props;
  const {
    form: { setFieldValue },
    field: { name },
  } = textFieldProps;

  const [currentCustomer, setCurrentCustomer] = useState<CustomerSummary | null>(initialCustomer);
  const [changingCustomer, setChangingCustomer] = useState<boolean>(false);

  const handleSearchClick = () => {
    setChangingCustomer(true);
  };

  const handleCustomerSelected = (customer: CustomerSummary) => {
    setCurrentCustomer(customer);
    setFieldValue(name, customer.id);
    setChangingCustomer(false);
  };

  const handleCustomerSelectionCancelled = () => {
    setChangingCustomer(false);
  };

  const getValue = () =>
    currentCustomer == null ? "" : currentCustomer.name;

  const searchAdornment = !readonly
    ? (
      <InputAdornment position="end">
        <Tooltip title="Search">
          <IconButton
            aria-label="search customers"
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
      <CustomerSelectDialog open={changingCustomer} 
                            onSelected={handleCustomerSelected} 
                            onCancel={handleCustomerSelectionCancelled} 
                            fixtures={{
                              domainName: getDomainName(user?.email)
                            }}/>
    </>
  )
};


export default CustomerSelect;