interface OrderCustomerUpdate {
  companyName?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  countryId?: number;
  taxNumber?: string | null;
}

export default OrderCustomerUpdate;