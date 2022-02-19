import React, { useState } from "react";
import { Box, Button, createStyles, makeStyles, Slide, TableCell, Theme, Tooltip, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import ClearAllIcon from "@material-ui/icons/ClearAll";
import EditIcon from "@material-ui/icons/Edit";
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import OrderDetailItem from "../../models/OrderDetailItem";
import Correlatable from "../../models/Correlatable";
import ItemsCard from "../../components/ItemsCard";
import { formatAud } from "../../formatters/NumberFormatters";
import ItemType from "../../models/ItemType";
import OrderItemTypeChip from "./OrderItemTypeChip";
import { formatDate } from "../../formatters/DateFormatters";
import ExpirationType from "../../models/ExpirationType";
import LowPriorityIcon from '@material-ui/icons/LowPriority';
import OrderItemTooltip from "./OrderItemTooltip";

const styles = (theme: Theme) =>
  createStyles({
    actionPanel: {
      marginTop: theme.spacing(1),
    },
    slideActionPanel: {
      borderLeft: `1px solid ${theme.palette.divider}`,
      marginLeft: theme.spacing(1),
      paddingLeft: theme.spacing(1),
    },
    actionButton: {
      variant: "text",
      color: "default",
      minWidth: 0,
      height: "100%",
      padding: theme.spacing(1),
    },
    actionCell: {
      width: "1%",
      whiteSpace: "nowrap",
    },
    rowActionPanel: {
      borderLeft: `1px solid ${theme.palette.divider}`,
      paddingLeft: theme.spacing(1),
    },
    rowActionButton: {
      variant: "text",
      color: "default",
      minWidth: 0,
      padding: theme.spacing(1),
    },
  });

const useStyles = makeStyles(styles);

interface OrderItemsCardProps {
  isLoading: boolean;
  items: (OrderDetailItem & Correlatable)[];
  showGst: boolean;
  gst: number;
  total: number;
  showEditControls: boolean;
  disableEditControls?: boolean;
  onAddItem: (type: ItemType) => void;
  disableAddItem?: (type: ItemType) => boolean;
  onClearItems: () => void;
  onViewItem: (item: OrderDetailItem & Correlatable) => void;
  onEditItem: (item: OrderDetailItem & Correlatable) => void;
  onRemoveItem: (item: OrderDetailItem & Correlatable) => void;
}

const OrderItemsCard: React.FC<OrderItemsCardProps> = (props: OrderItemsCardProps) => {
  const classes = useStyles();

  const [showIds, setShowIds] = useState<boolean>(false);

  const [showingEditControls, setShowingEditControls] = useState<boolean>(false);

  function handleClearItems() {
    props.onClearItems();
  }

  function handleToggleShowIds() {
    setShowIds(!showIds);
  }

  const showPoolColumn = props.items.some(item => item.subscriptionPool);
  const showActionColumn = props.showEditControls || showingEditControls;
  const showServerIdColumn = props.items.some(item => item.id);
  const showAlignToItemIndicator = props.items.some(item => item.expirationType === ExpirationType.AlignToItem);
  const alignToItemColumnIndex = 5;

  function getColumnHeaders(): React.ReactNode[] {
    let cells: React.ReactNode[] = [];

    if (showIds) {
      if (showActionColumn) {
        cells.push(
          <TableCell key="correlationId" align="right">#</TableCell>,
        );
      }
      if (showServerIdColumn) {
        cells.push(
          <TableCell key="id" align="right">ID</TableCell>,
        );
      }
    }

    if (showPoolColumn) {
      cells.push(
        <TableCell key="pool">Pool</TableCell>,
      );
    }

    cells.push(
      <TableCell key="product">Product</TableCell>,
      <TableCell key="licenseType">License Type</TableCell>,
      <TableCell key="type" align="center">Item Type</TableCell>,
      <TableCell key="currentExpiry" align="right">Current Expiry</TableCell>,
      <TableCell key="expiry" align="right">New Expiry</TableCell>,
      // maybe align to item indicator
      <TableCell key="unitPrice" align="right">Unit Price</TableCell>,
      <TableCell key="quantity" align="right">Quantity</TableCell>,
      <TableCell key="total" align="right">Total</TableCell>,
      <TableCell key="view" className={classes.actionCell}/>
    );
    
    if (showAlignToItemIndicator) {
      cells.splice(
        alignToItemColumnIndex, 
        0, 
        <TableCell key="alignedToItem" className={classes.actionCell}/>);
    }

    if (showActionColumn) {
      cells.push(
        <TableCell key="actions" className={classes.actionCell} />,
      );
    }

    return cells;
  }

  function getRowCells(item: OrderDetailItem & Correlatable): React.ReactNode[] {
    let cells: React.ReactNode[] = [];

    if (showIds) {
      if (showActionColumn) {
        cells.push(
          <TableCell key="correlationId" align="right">{item.correlationId}</TableCell>,
        );
      }
      if (showServerIdColumn) {
        cells.push(
          <TableCell key="id" align="right">{item.id}</TableCell>,
        );
      }
    }

    if (showPoolColumn) {
      cells.push(
        <TableCell key="pool">{item.subscriptionPool?.name}</TableCell>,
      );
    }

    cells.push(
      <TableCell key="product">{item.product.name}</TableCell>,
      <TableCell key="licenseType">{item.licenseType}</TableCell>,
      <TableCell key="type" align="center">
        <OrderItemTypeChip itemType={item.type}/>
      </TableCell>,
      <TableCell key="currentExpiry" align="right">{formatDate(item.renewedSubscriptionKey?.expiryDate ?? null)}</TableCell>,
      <TableCell key="expiry" align="right">{item.expiryDate != null ? formatDate(item.expiryDate) : "12 months"}</TableCell>,
      // maybe align to item indicator
      <TableCell key="unitPrice" align="right">{formatAud(item.unitPrice)}</TableCell>,
      <TableCell key="quantity" align="right">{item.quantity}</TableCell>,
      <TableCell key="total" align="right">{formatAud(item.total)}</TableCell>,
      <TableCell key="view">
        <Tooltip title="View">
          <Button className={classes.rowActionButton}
                  aria-label="view item"
                  onClick={() => props.onViewItem(item)}>
            <VisibilityIcon fontSize="small"/>
          </Button>
        </Tooltip>
      </TableCell>
    );

    if (showAlignToItemIndicator) {
      cells.splice(
        alignToItemColumnIndex, 
        0, 
        <TableCell key="alignedToItem" className={classes.actionCell}>
          {item.expirationType === ExpirationType.AlignToItem &&
          <OrderItemTooltip arrow item={props.items.find(i => i.correlationId === item.alignToLineCorrelationId) ?? null}>
            <LowPriorityIcon fontSize="small"/>
          </OrderItemTooltip>
          }
        </TableCell>);
    }

    if (showActionColumn) {
      cells.push(
        <TableCell key="actions" className={classes.actionCell}>
          <Slide in={props.showEditControls}
                 direction="left">
            <Box className={classes.rowActionPanel}>
              <Tooltip title="Modify">
                <Button className={classes.rowActionButton}
                        aria-label="modify item"
                        onClick={() => props.onEditItem(item)}
                        disabled={props.disableEditControls}>
                  <EditIcon fontSize="small" />
                </Button>
              </Tooltip>
              <Tooltip title="Remove">
                <Button className={classes.rowActionButton}
                        aria-label="remove item"
                        onClick={() => props.onRemoveItem(item)}
                        disabled={props.disableEditControls}>
                  <DeleteOutlineIcon fontSize="small" />
                </Button>
              </Tooltip>
            </Box>
          </Slide>
        </TableCell>
      );
    }

    return cells;
  }

  function getFooters(): React.ReactNode[][] {
    let labelColSpan = 7;
    
    if (showIds) {
      if (showActionColumn) {
        labelColSpan++;
      }
      if (showServerIdColumn) {
        labelColSpan++;
      }
    }
    
    if (showAlignToItemIndicator) {
      labelColSpan++;
    }

    if (showPoolColumn) {
      labelColSpan++;
    }
    
    let rows: React.ReactNode[][] = [];

    if (props.showGst) {
      rows.push([
        <TableCell key="gstLabel" align="right" colSpan={labelColSpan}>
          <Typography variant="h6">GST</Typography>
        </TableCell>,
        <TableCell key="gstAmount" align="right">
          <Typography variant="h6">{formatAud(props.gst)}</Typography>
        </TableCell>,
        <TableCell key={"view"}/>
      ]);
      if (showActionColumn) {
        rows[rows.length-1].push(<TableCell key="actions" className={classes.actionCell} />)
      }
    }
    rows.push([
      <TableCell key="totalLabel" align="right" colSpan={labelColSpan}>
        <Typography variant="h5">Total</Typography>
      </TableCell>,
      <TableCell key="totalAmount" align="right">
        <Typography variant="h5">{formatAud(props.total)}</Typography>
      </TableCell>,
      <TableCell key={"view"}/>
    ]);
    if (showActionColumn) {
      rows[rows.length-1].push(<TableCell key="actions" className={classes.actionCell} />)
    }
    return rows;
  }

  return (
    <ItemsCard title="Items"
               headerAction={
                 <Box className={classes.actionPanel}
                      display="flex">
                   <Box>
                     <Tooltip title={`${showIds ? "Hide" : "Show"} IDs`}>
                       <Button className={classes.actionButton}
                               aria-label={`${showIds ? "hide" : "show"} IDs`}
                               onClick={handleToggleShowIds}>
                         {showIds ? (<VisibilityIcon />) : (<VisibilityOffIcon />)}
                       </Button>
                     </Tooltip>
                   </Box>
                   <Box>
                     <Slide in={props.showEditControls}
                            direction="left"
                            onEntering={() => setShowingEditControls(true)}
                            onExited={() => setShowingEditControls(false)}
                            unmountOnExit>
                       <Box className={classes.slideActionPanel}>
                         <Tooltip title="Add Item">
                           <Button className={classes.actionButton}
                                   aria-label="add item"
                                   onClick={() => props.onAddItem(ItemType.New)}
                                   disabled={(props.disableAddItem && props.disableAddItem(ItemType.New)) || props.disableEditControls}>
                             <AddIcon />
                           </Button>
                         </Tooltip>
                         <Tooltip title="Clear Items">
                           <span>
                             <Button className={classes.actionButton}
                                     aria-label="clear items"
                                     onClick={handleClearItems}
                                     disabled={props.items.every(item => !item.isActive) || props.disableEditControls}>
                               <ClearAllIcon/>
                             </Button>
                           </span>
                         </Tooltip>
                       </Box>
                     </Slide>
                   </Box>
                 </Box>
               }
               isLoading={props.isLoading}
               columnHeaders={getColumnHeaders()}
               items={props.items.filter(item => item.isActive)}
               itemKeySelector={item => item.correlationId}
               itemRowCellProvider={getRowCells}
               footers={getFooters()}
               noItemsMessage="There are no items in this order"/>
  );
};

export default OrderItemsCard;