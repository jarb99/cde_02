import React from "react";
import { Dialog, DialogContent, DialogActions, DialogProps, Box, Button, Divider } from "@material-ui/core";
import DialogHeader from "./DialogHeader";

interface ErrorDialogProps {
  open: boolean;
  onClose?: () => void;
  fullScreen?: boolean;
  fullWidth?: boolean;
  dialogProps?: DialogProps;
  title: string;
  subtitle?: string;
  avatar?: React.ReactNode;
  headerAction?: React.ReactNode;
  showProgress?: boolean;
  disableClose?: boolean;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
}

const ErrorDialog: React.FC<ErrorDialogProps> = (props) => {
  const dialogProps: DialogProps = {
    children:   undefined,
    ...props.dialogProps,
    open:       props.open,
    onClose:    props.onClose,
    fullScreen: props.fullScreen,
    fullWidth:  props.fullWidth,
  }

  return (
    <Dialog {...dialogProps}>
      <DialogHeader
        title={props.title}
        subtitle={props.subtitle}
        avatar={props.avatar}
        action={props.headerAction}
        showProgress={props.showProgress}
        disableClose={props.disableClose}
        onClose={props.onClose} />
      <DialogContent style={{ padding: 0 }}>
        {props.children}
      </DialogContent>
      <Divider />
      <DialogActions>
        <Box display="flex" alignItems="center" style={{width: "100%"}}>
          <Box>
            {props.secondaryAction}
          </Box>
          <Box flexGrow={1}></Box>
          <Box>
            {props.action}
          </Box>
          <Box>
            <Button color="primary" disabled={props.disableClose} onClick={props.onClose}>
              Close
            </Button>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default ErrorDialog;