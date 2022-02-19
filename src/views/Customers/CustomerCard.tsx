import * as React from "react";
import { Card, CardHeader, Typography } from "@material-ui/core";
import CustomerAvatar from "./CustomerAvatar";
import { Skeleton } from "@material-ui/lab";

interface CustomerCardProps {
  isLoading: boolean;
  id?: number;
  name?: string;
  city?: string;
  state?: string;
  country?: string;
  isReseller?: boolean;
}

const CustomerCard: React.FC<CustomerCardProps> = (props: CustomerCardProps) => {
  const {isLoading, name, city, state, country} = props;

  const location = `${city || state || ""}${(city || state) && country ? ", " : ""}${country || ""}`;

  const title = isLoading
    ? <Skeleton width="60%"/>
    : <Typography variant="h5">{name}</Typography>

  const subheader = isLoading
    ? <Skeleton width="40%"/>
    : location;

  return (
    <Card>
      <CardHeader
        avatar={<CustomerAvatar isReseller={props.isReseller}/>}
        title={title}
        subheader={subheader}/>
    </Card>
  );
};

export default CustomerCard;