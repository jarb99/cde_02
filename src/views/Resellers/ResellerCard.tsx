import * as React from "react";
import { Card, CardHeader, Typography } from "@material-ui/core";
import CustomerAvatar from "../Customers/CustomerAvatar";
import ResellerLink from "./ResellerLink";

interface ResellerCardProps {
  id?: number;
  name?: string;
  city?: string;
  state?: string;
  country?: string;
}

const ResellerCard: React.FC<ResellerCardProps> = (props: ResellerCardProps) => {
  const location = `${props.city || props.state || ""}${(props.city || props.state) && props.country ? ", " : ""}${props.country || ""}`;

  return (
    <Card>
      <CardHeader
        avatar={<CustomerAvatar isReseller={true} />}
        title={<ResellerLink customerId={props?.id || 0}><Typography variant="h5" color="primary">{props?.name}</Typography></ResellerLink>}
        subheader={location}/>
    </Card>
  );
};

export default ResellerCard;