import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { generatePath } from "react-router";
import { userPath } from "../../Routes";
import { Link } from "@material-ui/core";

interface UserLinkProps {
  userId: number;
}

const UserLink: React.FC<UserLinkProps> = (props: UserLinkProps) => {
  const {userId, ...rest} = props;
  return <Link component={RouterLink} variant="inherit" to={generatePath(userPath, {userId})} {...rest}/>
};

export default UserLink;