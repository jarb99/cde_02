import React from "react";
import { Box, Grid, TableCell, TableCellProps, Typography } from "@material-ui/core";
import CountrySummary from "../../models/CountrySummary";
import CustomerLink from "../Customers/CustomerLink";


interface CustomerTableCellProps extends TableCellProps {
  customerId: number;
  name: string;
  country?: CountrySummary;
}

const CustomerTableCell: React.FC<CustomerTableCellProps> = (props) => {
  const {customerId, name, country, ...tableCellProps} = props;
  
  return (
    <TableCell {...tableCellProps}>
      <Grid container alignItems="flex-start">
        <Grid item>
          <CustomerLink customerId={customerId}>
            <Box component="span" fontWeight="fontWeightMedium">{name}</Box>
          </CustomerLink>
        </Grid>
        <Grid item xs={12}>
          <Typography color="textSecondary">{country?.name}</Typography>
        </Grid>
      </Grid>
    </TableCell>
  );
};

export default CustomerTableCell;