interface CountrySummary {
  id: number;
  name: string;
}

function isGstApplicable(country?: CountrySummary): boolean {
  return country?.name === "Australia";
}

export { isGstApplicable };
export default CountrySummary;