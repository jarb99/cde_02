interface PricingBand {
  id: number;
  minQuantity: number | undefined;
  maxQuantity: number | undefined;
  unitPrice: number;
}

export default PricingBand;
