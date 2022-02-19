import React, { MouseEventHandler } from "react";
import DialogTitle from "./DialogTitle";
import { createStyles, Divider, Fade, IconButton, LinearProgress, makeStyles, Theme } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";


interface DialogHeaderProps {
  title: string;
  subtitle?: string;
  avatar?: React.ReactNode;
  action?: React.ReactNode;
  showProgress?: boolean;
  disableClose?: boolean;
  onClose?: MouseEventHandler;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    progress: {
      height: 1,
      marginTop: -1
    }
  }),
);

const DialogHeader: React.FC<DialogHeaderProps> = (props: DialogHeaderProps) => {
  const classes = useStyles();

  const {
    title,
    subtitle,
    avatar,
    action,
    showProgress,
    disableClose,
  } = props;

  const handleClose: MouseEventHandler = (event) => {
    if (props.onClose) {
      props.onClose(event);
    }
  };

  const actions = (
    <>
    {action}
    <IconButton aria-label="close" disabled={disableClose} onClick={handleClose}>
      <CloseIcon fontSize="small"/>
    </IconButton>
    </>
  );

  return (
    <>
      <DialogTitle title={title} subtitle={subtitle} avatar={avatar} action={actions}/>
      <Divider/>
      <Fade in={showProgress || false}>
        <LinearProgress className={classes.progress}/>
      </Fade>
    </>
  );
};

export default DialogHeader;