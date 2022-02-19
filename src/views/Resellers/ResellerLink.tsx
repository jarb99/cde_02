import * as React from "react";
import { Link } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import { generatePath } from "react-router";
import { resellerPath } from "../../Routes";


interface ResellerLinkProps {
  customerId: number;
}

const ResellerLink: React.FC<ResellerLinkProps> = (props) => {
  const {customerId, ...rest} = props;
  return <Link component={RouterLink} variant="inherit" to={generatePath(resellerPath, {customerId})} {...rest}/>
};

export default ResellerLink;