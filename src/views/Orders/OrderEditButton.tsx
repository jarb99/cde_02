import * as React from "react";
import { Button, ButtonGroup, ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper } from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';


interface OrderEditButtonProps {
  className?: string;
  disabled?: boolean;
  onEditOrderClick: () => void;
  onCancelOrderClick: () => void;
}

const OrderEditButton: React.FC<OrderEditButtonProps> = (props) => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement | null>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
    
  const options = [
    {text: "Edit", icon: <EditIcon/>, onClick: props.onEditOrderClick},
    {text: "Cancel Order", icon: <CancelIcon/>, onClick: props.onCancelOrderClick}
  ];

  const handleMenuItemClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>, index: number) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClose = (event: React.MouseEvent<Document>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as Node)) {
      return;
    }

    setOpen(false);
  };

  const selectedOption = options[selectedIndex];
  
  return (
    <>
      <ButtonGroup className={props.className}
                   disabled={props.disabled}
                   variant="contained" 
                   color="primary" 
                   size="large" 
                   ref={anchorRef} 
                   aria-label="split button">
        <Button onClick={selectedOption.onClick}
                startIcon={selectedOption.icon}>
          {selectedOption.text}
        </Button>
        <Button size="small"
                aria-controls={open ? 'split-button-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-label="select edit mode"
                aria-haspopup="menu"
                onClick={handleToggle}>
          <ArrowDropDownIcon/>
        </Button>
      </ButtonGroup>
      <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
        {({TransitionProps, placement}) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu">
                  {options.map((option, index) => (
                    <MenuItem key={index}
                              selected={index === selectedIndex}
                              onClick={event => handleMenuItemClick(event, index)}>
                      {option.text}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}

export default OrderEditButton;