import CountrySummary from "./CountrySummary";
import UserSummary from "./UserSummary";

interface CustomerSummary {
  id: number;
  isActive: boolean;
  name: string;
  country: CountrySummary;
  owner: UserSummary | null;
  isReseller: boolean;
  createdDateTime: Date;
}

export default CustomerSummary;