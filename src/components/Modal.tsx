import React, { MouseEventHandler } from "react";
import {
  Backdrop,
  Card,
  CardContent,
  CardHeader,
  createStyles,
  Divider,
  Fade,
  Grid,
  IconButton,
  LinearProgress,
  makeStyles,
  Modal as MaterialModal,
  ModalProps as MaterialModalProps,
  Theme,
  Typography
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";


interface ModalProps extends MaterialModalProps {
  title: string;
  icon: JSX.Element;
  onClose: MouseEventHandler;
  showProgress?: boolean;
  disableClose?: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    progress: {
      height: 1,
      marginTop: -1
    }
  }),
);

const Modal: React.FC<ModalProps> = (props) => {
  const classes = useStyles();

  const handleClose: MouseEventHandler = (event) => {
    if (props.onClose) {
      props.onClose(event);
    }
  };

  const title = (
    <Grid container direction="row" spacing={1} alignItems="center">
      <Grid item>
        {props.icon}
      </Grid>
      <Grid item>
        <Typography variant="h5">
          {props.title}
        </Typography>
      </Grid>
    </Grid>
  );

  return (
    <MaterialModal
      className={classes.root}
      closeAfterTransition
      disableRestoreFocus
      disableBackdropClick={props.disableClose}
      disableEscapeKeyDown={props.disableClose}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500
      }}
      open={props.open}
      onClose={props.onClose}
    >
      <Fade in={props.open}>
        <Card>
          <CardHeader title={title}
                      action={
                        <IconButton aria-label="close" disabled={props.disableClose} onClick={handleClose}>
                          <CloseIcon fontSize="small"/>
                        </IconButton>
                      }/>
          <Divider/>
          <Fade in={props.showProgress || false}>
            <LinearProgress className={classes.progress}/>
          </Fade>
          <CardContent style={{ padding: 0 }}>
            {props.children}
          </CardContent>
        </Card>
      </Fade>
    </MaterialModal>
  );
};

export default Modal;