import React, { useEffect, useState } from "react";
import { Card, CardHeader, IconButton, Link, Typography } from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import UserEditDialog, { UserEditFields } from "./UserEditDialog";
import UserAvatar from "./UserAvatar";
import { getFullName } from "./userUtils";

interface UserCardProps {
  isLoading: boolean;
  userId?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
}

const UserCard: React.FC<UserCardProps> = (props: UserCardProps) => {
  const [editing, setEditing] = useState(false);
  const [state, setState] = useState<Partial<UserEditFields>>({
    userId: props.userId,
    firstName: props.firstName,
    lastName: props.lastName,
    email: props.email
  });
  
  useEffect(() => {
    setState(props);
  }, [props]);
  
  const handleClose = () => {
    setEditing(false);
  };
  
  const handleSubmitted = (values: UserEditFields) => {
    setState(values);
    handleClose();
  };
  
  return (
    <>
      <Card>
        <CardHeader avatar={<UserAvatar/>}
                    title={<Typography variant="h5">{getFullName(state.firstName, state.lastName)}</Typography>}
                    subheader={state.email && <Link href={`mailto:${state.email}`}>{state.email}</Link>}
                    action={
                      <IconButton aria-label="edit" onClick={() => setEditing(true)} disabled={props.isLoading}>
                        <EditIcon fontSize="small"/>
                      </IconButton>
                    }/>
      </Card>
   
      <UserEditDialog open={editing} 
                      onSubmitted={handleSubmitted} 
                      onCancel={handleClose}
                      userId={state.userId || 0}
                      firstName={state.firstName || ""}
                      lastName={state.lastName || ""}
                      email={state.email || ""}/>
    </>
  );
};

export default UserCard;
