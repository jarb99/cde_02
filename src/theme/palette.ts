import {
  PaletteOptions,
  SimplePaletteColorOptions,
  ColorPartial
} from "@material-ui/core/styles/createPalette";
import { colors } from "@material-ui/core";

// Use module augmentation to extend palette
// https://material-ui.com/guides/typescript/
// https://github.com/mui-org/material-ui/issues/13802
declare module "@material-ui/core/styles/createPalette" {
  interface Palette {
    link: string;
    icon: string;
  }

  interface PaletteOptions {
    link: string;
    icon: string;
  }

  interface TypeText {
    link: string;
  }
}

const white = "#FFFFFF";

const paletteOptions: PaletteOptions = {
  primary: {
    contrastText: white,
    dark: colors.orange[900],
    main: colors.orange[600],
    light: colors.orange[300]
  },
  secondary: {
    contrastText: white,
    dark: colors.lightBlue[900],
    main: colors.lightBlue.A700,
    light: colors.lightBlue.A400
  },
  error: {
    contrastText: white,
    dark: colors.red[900],
    main: colors.red[600],
    light: colors.red[400]
  },
  text: {
    primary: colors.blueGrey[900],
    secondary: colors.blueGrey[600],
    link: colors.blue[600]
  },
  link: colors.blue[800],
  icon: colors.blueGrey[600],
  background: {
    default: "#F4F6F8",
    paper: white
  },
  divider: colors.grey[200]
};

export default paletteOptions;

// Type Guard FTW
// https://medium.com/ovrsea/checking-the-type-of-an-object-in-typescript-the-type-guards-24d98d9119b0
export function isSimplePaletteColorOptions(
  colorOptions: SimplePaletteColorOptions | ColorPartial
): colorOptions is SimplePaletteColorOptions {
  if ((colorOptions as SimplePaletteColorOptions).main) {
    return true;
  }
  return false;
}
