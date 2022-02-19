import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { generatePath } from "react-router";
import { customerPath } from "../../Routes";
import { Link } from "@material-ui/core";

interface CustomerLinkProps {
  customerId: number;
}

const CustomerLink: React.FC<CustomerLinkProps> = (props) => {
  const {customerId, ...rest} = props;
  return <Link component={RouterLink} variant="inherit" to={generatePath(customerPath, {customerId})} {...rest}/>
};

export default CustomerLink;