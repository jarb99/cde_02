import React from "react";
import { Box, Grid, TableCell, TableCellProps, Typography } from "@material-ui/core";
import UserLink from "../Users/UserLink";


interface UserTableCellProps extends TableCellProps {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
}

const UserTableCell: React.FC<UserTableCellProps> = (props) => {
  const {userId, firstName, lastName, email, ...tableCellProps} = props;

  return (
    <TableCell {...tableCellProps}>
      <Grid container>
        <Grid item>
          <UserLink userId={userId}>
            <Box component="span" fontWeight="fontWeightMedium">{`${firstName} ${lastName}`}</Box>
          </UserLink>
        </Grid>
        <Grid item xs={12}>
          <Typography color="textSecondary">{email}</Typography>
        </Grid>
      </Grid>
    </TableCell>
  );
};

export default UserTableCell;