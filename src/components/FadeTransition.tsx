import React from "react";
import Transition from "react-transition-group/Transition";
import { duration } from "@material-ui/core";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import TransitionStyles from "./TransitionStyles";

const defaultTimeout = {
  enter: duration.enteringScreen,
  exit: duration.leavingScreen
};

const defaultTransitionStyles: TransitionStyles = {
  entering: { opacity: 1 },
  entered: { opacity: 1 }
};

interface FadeTransitionProps {
  children: React.ReactElement;
  in: boolean;
  duration?: number;
  fadedOpacity?: number;
  defaultStyle?: CSSProperties;
  transitionStyles?: TransitionStyles;
}

const FadeTransition = ({
  children,
  in: inProp,
  duration,
  fadedOpacity = 0,
  defaultStyle,
  transitionStyles
}: FadeTransitionProps) => (
  <Transition in={inProp} timeout={defaultTimeout}>
    {state =>
      React.cloneElement(children, {
        style: {
          transition: `opacity ${duration || 400}ms ease-in-out`,
          opacity: fadedOpacity,
          ...defaultStyle,
          ...defaultTransitionStyles[state],
          ...(transitionStyles ? transitionStyles[state] : {}),
          ...children.props.style
        }
      })
    }
  </Transition>
);

export default FadeTransition;
