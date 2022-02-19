import ProductSummary from "./ProductSummary";

interface CustomerLicense {
  id: number;
  isActive: boolean | null;
  product: ProductSummary;
  serialCode: string;
  creationDateTime: Date | null;
  expirationDateTime: Date | null;
  usageDays: number | null;
  userName: string;
  userCompanyName: string;
  userEmail: string;
  quantity: number | null;
  activations: number | null;
  maxActivations: number | null;
  isTrial: boolean | null;
  isBeta: boolean | null;
  isTransmit: boolean | null;
  isSite: boolean | null;
  parentIds: number[];
  childIds: number[];
  subscriptionIds: number[];
}

export default CustomerLicense;