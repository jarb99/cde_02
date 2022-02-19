export const tryParseInt = (s: string | null | undefined, radix?: number | undefined): number | undefined => {
  if (s) {
    const value = parseInt(s, radix);
    if (!isNaN(value)) {
      return value;
    }
  }
  return undefined;
}

export const tryParseFloat = (s: string | null | undefined): number | undefined => {
  if (s) {
    const value = parseFloat(s);
    if (!isNaN(value)) {
      return value;
    }
  }
  return undefined;
}
