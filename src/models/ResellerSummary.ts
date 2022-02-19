import CountrySummary from "./CountrySummary";

interface ResellerSummary {
  id: number;
  name: string;
  city: string;
  state: string;
  country: CountrySummary;
}

export default ResellerSummary;
