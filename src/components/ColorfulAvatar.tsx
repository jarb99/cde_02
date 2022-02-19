import React from "react";
import { Avatar, AvatarProps, createStyles, makeStyles, Theme } from "@material-ui/core";


interface ColorfulAvatarProps extends AvatarProps {
  colorSeed: string;
  saturation?: number;
  lightness?: number;
}

const stringToHslColor = (s: string, saturation: number = 80, lightness: number = 60) => {
  if (s == null || s == "") {
    return "";
  }

  let hash = 0;

  for (let c of s) {
    hash = c.charCodeAt(0) + ((hash << 5) - hash);
  }

  return `hsl(${Math.abs(hash) % 24 * 15}, ${saturation}%, ${lightness}%)`;
};

const styles = (theme: Theme) =>
  createStyles({
    avatar: (props: ColorfulAvatarProps) => ({
      backgroundColor: stringToHslColor(props.colorSeed, props.saturation, props.lightness)
    })
  });

const useStyles = makeStyles(styles);

const ColorfulAvatar: React.FC<ColorfulAvatarProps> = (props: ColorfulAvatarProps) => {
  const {colorSeed, saturation, lightness, ...avatarProps} = props;
  const classes = useStyles(props);

  return <Avatar className={colorSeed ? classes.avatar : ""} {...avatarProps}/>
};

export default ColorfulAvatar;