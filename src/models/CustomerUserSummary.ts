import CustomerSummary from "./CustomerSummary";
import UserSummary from "./UserSummary";
import CustomerUserRole from "./CustomerUserRole";

interface CustomerUserSummary {
  customer: CustomerSummary;
  user: UserSummary;
  isActive: boolean;
  role: CustomerUserRole;
  createdDateTime: Date;
}

export default CustomerUserSummary;