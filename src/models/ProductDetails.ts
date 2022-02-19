import PricingBand from "./PricingBand";

interface ProductDetails {
  id: number;
  name: string;
  pricingBands: PricingBand[];
  isSubscription: boolean;
  renewalUnitPrice: number | undefined;
}

export default ProductDetails;
