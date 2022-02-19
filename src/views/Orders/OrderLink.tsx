import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { generatePath } from "react-router";
import { orderPath } from "../../Routes";
import { Link } from "@material-ui/core";

interface OrderLinkProps {
  orderId: number;
}

const OrderLink: React.FC<OrderLinkProps> = (props: OrderLinkProps) => {
  const {orderId, ...rest} = props;
  return <Link component={RouterLink} variant="inherit" to={generatePath(orderPath, {orderId})} {...rest}/>
};

export default OrderLink;