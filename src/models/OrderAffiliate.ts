interface OrderAffiliate {
  id: number;
  code: string | null;
  name: string | null;
  rate: number | null;
  isPaid: boolean;
}

export default OrderAffiliate;