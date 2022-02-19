export const formatAud = (value: number): string =>
  Intl.NumberFormat("en-AU", {style: "currency", currency: "AUD", currencyDisplay: "symbol"})
    .format(value);

export const formatNumber = (value: number | null, fractionDigits: number = 2): number | null =>
  value == null
    ? null
    : parseFloat(value.toFixed(fractionDigits));

export const formatNumberString = (value: number | null, fractionDigits: number = 2): string => {
    return value == null
      ? ""
      : Intl.NumberFormat("en-AU", {
          style: "decimal",
          minimumFractionDigits: fractionDigits,
          maximumFractionDigits: fractionDigits
      }).format(formatNumber(value, fractionDigits) ?? 0);
}
