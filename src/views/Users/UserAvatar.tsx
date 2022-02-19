import React from "react";
import PersonIcon from "@material-ui/icons/Person";
import { Avatar } from "@material-ui/core";


interface UserAvatarProps {
}

const UserAvatar: React.FC<UserAvatarProps> = (props: UserAvatarProps) => {
  return <Avatar><PersonIcon/></Avatar>;
};

export default UserAvatar;

