import PaymentMethod from "./PaymentMethod";

interface OrderPaid {
  paymentMethod: PaymentMethod;
  executeFulfillment: boolean;
}

export default OrderPaid;