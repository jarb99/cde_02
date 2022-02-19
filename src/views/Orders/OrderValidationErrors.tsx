import * as React from "react";
import { Typography } from "@material-ui/core";


interface OrderValidationErrorsProps {
  errors: string[];
}

const OrderValidationErrors: React.FC<OrderValidationErrorsProps> = (props) => {
  if (props.errors == null || props.errors.length === 0) {
    return null;
  }

  return (
    <>
      <Typography>
        The following validation errors have been identified:
      </Typography>
      <ul>
        {props.errors.map((value, index) => (
          <Typography color="error" component="li" key={index}>{value}</Typography>
        ))}
      </ul>
    </>
  );
};


export default OrderValidationErrors;