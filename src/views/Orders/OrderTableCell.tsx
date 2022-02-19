import React from "react";
import { Box, TableCell, TableCellProps } from "@material-ui/core";
import OrderLink from "./OrderLink";


interface OrderTableCellProps extends TableCellProps {
  orderId: number;
}

const OrderTableCell: React.FC<OrderTableCellProps> = (props) => {
  const {orderId, ...tableCellProps} = props;
  
  return (
    <TableCell {...tableCellProps}>
      <OrderLink orderId={orderId}>
        <Box component="span" fontWeight="fontWeightMedium">{orderId}</Box>
      </OrderLink>
    </TableCell>
  );
};

export default OrderTableCell;