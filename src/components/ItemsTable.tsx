import React, { useState } from "react";
import {
  Checkbox,
  colors,
  createStyles,
  LinearProgress,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
  Theme
} from "@material-ui/core";
import FadeTransition from "./FadeTransition";

const styles = (theme: Theme) =>
  createStyles({
    inner: {
      minWidth: 700
    },
    progress: {
      height: 1,
      marginTop: -1
    },
    footer: {
      backgroundColor: colors.grey[50],
    }
  });

const useStyles = makeStyles(styles);

export interface ItemsTableProps<TItem, TKey extends React.Key> {
  isLoading: boolean;
  hideProgress?: boolean;
  columnHeaders: React.ReactNode[];
  stickyHeader?: boolean;
  items: TItem[];
  itemKeySelector: (item: TItem) => TKey;
  itemRowCellProvider: (item: TItem) => React.ReactNode[];
  selectedItemKeys?: TKey[];
  onChangeSelectedItemKeys?: (keys: TKey[]) => void;
  hideSelectAll?: boolean;
  footers?: React.ReactNode[] | React.ReactNode[][];
}

function ItemsTable<TItem, TKey extends React.Key>({
  isLoading,
  hideProgress = false,
  columnHeaders,
  stickyHeader,
  items,
  itemKeySelector,
  itemRowCellProvider,
  selectedItemKeys,
  onChangeSelectedItemKeys,
  hideSelectAll,
  footers,
}: ItemsTableProps<TItem, TKey>) {
  const [wasLoaded, setWasLoaded] = useState<boolean>(false);

  if (!wasLoaded && !isLoading) {
    setWasLoaded(true);
  }

  function handleSelectAll(event: React.ChangeEvent<HTMLInputElement>) {
    if (onChangeSelectedItemKeys) {
      if (event.target.checked) {
        const itemKeys = items.map(item => getKey(item));
        onChangeSelectedItemKeys(itemKeys);
      } else {
        onChangeSelectedItemKeys([]);
      }
    }
  }

  function handleSelectOne(item: TItem) {
    if (selectedItemKeys && onChangeSelectedItemKeys) {
      const key = getKey(item);
      const selectedIndex = selectedItemKeys.indexOf(key);
      if (selectedIndex === -1) {
        onChangeSelectedItemKeys(selectedItemKeys.concat(key));
      } else if (selectedIndex === 0) {
        onChangeSelectedItemKeys(selectedItemKeys.slice(1));
      } else if (selectedIndex === selectedItemKeys.length - 1) {
        onChangeSelectedItemKeys(selectedItemKeys.slice(0, -1));
      } else if (selectedIndex > 0) {
        onChangeSelectedItemKeys(
          selectedItemKeys
            .slice(0, selectedIndex)
            .concat(selectedItemKeys.slice(selectedIndex + 1))
        );
      }
    }
  }

  function getKey(item: TItem): TKey {
    return itemKeySelector(item);
  }

  function isSelected(item: TItem): boolean {
    if (selectedItemKeys) {
      const key = getKey(item);
      return selectedItemKeys.indexOf(key) !== -1;
    }
    return false;
  }

  function getFooterRows(): React.ReactNode[] {
    if (footers) {
      if (footers.length > 0) {
        let rows: React.ReactNode[][];
        if (footers[0] instanceof Array) {
          rows = footers as React.ReactNode[][];
        } else {
          rows = [footers];
        }
        return rows.map((cells, rowIndex) => renderFooterRow(cells, rowIndex));
      }
    }
    return [];
  }

  function renderFooterRow(cells: React.ReactNode[], rowIndex: number): React.ReactNode {
    return (
      <TableRow key={`footer-${rowIndex}`}>
        {cells}
      </TableRow>
    );
  }

  const classes = useStyles();
  return (
    <div className={classes.inner}>
      <Table stickyHeader={stickyHeader === true}>
        <TableHead>
          <TableRow>
            {selectedItemKeys && hideSelectAll === true && (
              <TableCell key="selection" />
            )}
            {selectedItemKeys && hideSelectAll !== true && (
              <TableCell key="selection"
                         padding="checkbox">
                <Checkbox
                  checked={
                    items.length > 0 && selectedItemKeys.length === items.length
                  }
                  color="primary"
                  indeterminate={
                    selectedItemKeys.length > 0 &&
                    selectedItemKeys.length < items.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
            )}
            {columnHeaders}
          </TableRow>
          {hideProgress !== true && (
            <TableRow>
              <TableCell
                style={{ padding: 0, border: 0 }}
                colSpan={columnHeaders.length + (selectedItemKeys ? 1 : 0)}
              >
                <FadeTransition in={isLoading} duration={isLoading ? 400 : 800}>
                  <LinearProgress className={classes.progress} />
                </FadeTransition>
              </TableCell>
            </TableRow>
          )}
        </TableHead>
        <FadeTransition
          in={!isLoading}
          duration={!isLoading ? 400 : 800}
          fadedOpacity={0.32}
        >
          <TableBody>
            {items.map(item => {
              const key = getKey(item);
              const isItemSelected = isSelected(item);
              return selectedItemKeys
                ?
                <TableRow
                  hover
                  key={key}
                  selected={isItemSelected}
                  role="Checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  onClick={() => handleSelectOne(item)}
                  style={{
                    cursor: "pointer",
                    height: 75
                  }}
                >
                  <TableCell key="selection"
                             padding="checkbox">
                    <Checkbox
                      checked={isItemSelected}
                      color="primary"
                      onChange={() => handleSelectOne(item)}
                      value={isItemSelected}
                    />
                  </TableCell>
                  {itemRowCellProvider(item)}
                </TableRow>
                :
                <TableRow hover key={key} tabIndex={-1}>
                  {itemRowCellProvider(item)}
                </TableRow>
            })}
          </TableBody>
        </FadeTransition>
        {footers && (
          <FadeTransition
            in={!isLoading}
            duration={!isLoading ? 400 : 800}
            fadedOpacity={0.32}
          >
            <TableFooter className={classes.footer}>
              {getFooterRows()}
            </TableFooter>
          </FadeTransition>
        )}
      </Table>
    </div>
  );
}

export default ItemsTable;
