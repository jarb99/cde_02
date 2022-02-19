import { CSSProperties } from "@material-ui/core/styles/withStyles";

export default interface TransitionStyles {
  entering?: CSSProperties;
  entered?: CSSProperties;
  exiting?: CSSProperties;
  exited?: CSSProperties;
  unmounted?: CSSProperties;
}
