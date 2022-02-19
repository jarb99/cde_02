import React from "react";
import { createStyles, makeStyles, Theme, Typography } from "@material-ui/core";


interface DialogTitleProps {
  title: string;
  subtitle?: string;
  avatar?: React.ReactNode;
  action?: React.ReactNode;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  avatar: {
    flex: '0 0 auto',
    marginRight: theme.spacing(1),
  },
  content: {
    flex: '1 1 auto',
  },
  action: {
    flex: '0 0 auto',
    alignSelf: 'flex-start',
    marginTop: theme.spacing(-1),
    marginRight: theme.spacing(-1),
  },
  title: {},
  subtitle: {}
}));


const DialogTitle: React.FC<DialogTitleProps> = (props: DialogTitleProps) => {
  const classes = useStyles();
  const {
    title: titleProp,
    subtitle: subtitleProp,
    avatar,
    action
  } = props;

  const title = (
    titleProp &&
    <Typography
      variant="h5"
      className={classes.title}
      component="span"
      display="block">
      {titleProp}
    </Typography>
  );

  const subtitle = (
    subtitleProp &&
    <Typography
      variant="body1"
      className={classes.subtitle}
      component="span"
      display="block">
      {subtitleProp}
    </Typography>
  );

  return (
    <div className={classes.root}>
      {avatar && <div className={classes.avatar}>{avatar}</div>}
      <div className={classes.content}>
        {title}
        {subtitle}
      </div>
      {action && <div className={classes.action}>{action}</div>}
    </div>
  );
};

export default DialogTitle;