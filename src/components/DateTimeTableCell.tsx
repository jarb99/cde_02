import * as React from "react";
import { Grid, GridJustification, TableCell, TableCellProps } from "@material-ui/core";
import { formatDate, formatTime } from "../formatters/DateFormatters";


interface DateTimeTableCellProps extends TableCellProps {
  dateTime: Date | null;
}

const DateTimeTableCell: React.FC<DateTimeTableCellProps> = (props) => {
  const {dateTime, ...tableCellProps} = props;
  
  const justify: GridJustification | undefined = tableCellProps.align === "right" ? "flex-end" : undefined; 
  
  return (
    <TableCell {...tableCellProps}>
      <Grid container justify={justify}>
        <Grid item>{formatDate(dateTime)}</Grid>
        <Grid item xs={12}>{formatTime(dateTime)}</Grid>
      </Grid>
    </TableCell>
  )
};

export default DateTimeTableCell;