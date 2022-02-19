import CustomerUserRole from "./CustomerUserRole";

interface CustomerUserUpdate {
  customerId: number;
  userId: number;
  role: CustomerUserRole;
  isActive: boolean;
}

export default CustomerUserUpdate;