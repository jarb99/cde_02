import OrderDetailItemUpdate from "./OrderDetailItemUpdate";

interface OrderUpdate {
  reference: string | null;
  dueDate: Date | null;
  userId: number;
  customerId: number;
  resellerId: number | null;
  items: OrderDetailItemUpdate[];
}

export default OrderUpdate;