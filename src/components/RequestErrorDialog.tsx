import React from "react";
import { AxiosError } from "axios";
import { createRequestErrorMessage } from "./RequestErrorMessage";
import ErrorDialog from "./ErrorDialog";
import { DialogProps, Button } from "@material-ui/core";

interface RequestErrorDialogProps {
  open: boolean;
  onClose?: () => void;
  fullScreen?: boolean;
  fullWidth?: boolean;
  dialogProps?: DialogProps;
  title?: string;
  subtitle?: string;
  avatar?: React.ReactNode;
  headerAction?: React.ReactNode;
  showProgress?: boolean;
  disableClose?: boolean;
  message: string;
  error: AxiosError | null;
  onRetry?: () => void;
}

const RequestErrorDialog: React.FC<RequestErrorDialogProps> = (props) => {
  return (
    <ErrorDialog
      open={props.open}
      onClose={props.onClose}
      fullScreen={props.fullScreen}
      fullWidth={props.fullWidth}
      dialogProps={props.dialogProps}
      title={props.title || "Error"}
      subtitle={props.subtitle}
      avatar={props.avatar}
      headerAction={props.headerAction}
      showProgress={props.showProgress}
      disableClose={props.disableClose}
      action={props.onRetry && (
        <Button color="primary" onClick={props.onRetry}>
          Retry
        </Button>
      )}>
      {createRequestErrorMessage(props.message, props.error)}
    </ErrorDialog>
  );
}

export default RequestErrorDialog;