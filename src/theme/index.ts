import createMuiTheme, {
  ThemeOptions
} from "@material-ui/core/styles/createMuiTheme";
import paletteOptions from "./palette";
import createTypographyOptions from "./typography";
import overrides from "./overrides";

const themeOptions: ThemeOptions = {
  palette: paletteOptions,
  typography: createTypographyOptions,
  overrides
};

export const theme = createMuiTheme(themeOptions);
