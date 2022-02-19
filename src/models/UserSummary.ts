import UserRole from "./UserRole";

interface UserSummary {
  id: number;
  isActive: boolean;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdDateTime: Date;
}

export default UserSummary;