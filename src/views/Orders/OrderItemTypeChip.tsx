import * as React from "react";
import ItemType from "../../models/ItemType";
import { Chip } from "@material-ui/core";


interface OrderItemTypeChipProps {
  itemType: ItemType;
}

const OrderItemTypeChip: React.FC<OrderItemTypeChipProps> = (props) => {
  return (
    <Chip variant="outlined"
          size="small"
          label={props.itemType === ItemType.Renewal ? "Renewal" : "New"}
          color={props.itemType === ItemType.Renewal ? "secondary" : "primary"} />
  )
};

export default OrderItemTypeChip;