import UserRole from "./UserRole";

interface UserDetails {
  id: number;
  isActive: boolean;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdDateTime: Date;
}

export default UserDetails;
