import * as React from "react";
import { Box, Grid, TableCell, TableCellProps, Tooltip, Typography, useTheme } from "@material-ui/core";
import CountrySummary from "../../models/CountrySummary";
import ResellerLink from "./ResellerLink";
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';


interface ResellerTableCellProps extends TableCellProps {
  customerId: number;
  name: string;
  country?: CountrySummary;
}

const ResellerTableCell: React.FC<ResellerTableCellProps> = (props) => {
  const {customerId, name, country, ...tableCellProps} = props;

  const theme = useTheme();
  
  return (
    <TableCell {...tableCellProps}>
      <Grid container alignItems="flex-start">
        <Grid container item spacing={1}>
          <Grid item>
            <ResellerLink customerId={customerId}>
              <Box component="span" fontWeight="fontWeightMedium">{name}</Box>
            </ResellerLink>
          </Grid>
          <Grid item style={{height: theme.typography.body1.fontSize}}>
            <Tooltip title="Reseller">
              <Typography color="textSecondary"><SupervisorAccountIcon fontSize="small"/></Typography>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography color="textSecondary">{country?.name}</Typography>
        </Grid>
      </Grid>
    </TableCell>
  );
};

export default ResellerTableCell;