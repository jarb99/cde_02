import CountrySummary from "./CountrySummary";
import ResellerSummary from "./ResellerSummary";
import UserSummary from "./UserSummary";

interface CustomerDetails {
  id: number;
  isActive: boolean;
  name: string;
  taxNumber: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: CountrySummary;
  phone: string;
  owner: UserSummary | null;
  revitLicenses: string;
  contactId: string;
  isReseller: boolean;
  reseller: ResellerSummary | null;
  createdDateTime: Date;
}

export default CustomerDetails;