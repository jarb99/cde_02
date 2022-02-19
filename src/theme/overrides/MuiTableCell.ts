import { StyleRules } from "@material-ui/core";
import { ComponentNameToClassKey } from "@material-ui/core/styles/overrides";

import createPalette from "@material-ui/core/styles/createPalette";
import createTypography from "@material-ui/core/styles/createTypography";
import paletteOptions from "../palette";
import createTypographyOptions from "../typography";

const palette = createPalette(paletteOptions);
const typographyOptions = createTypographyOptions(palette);
const typography = createTypography(palette, typographyOptions);

const MuiTableCell: Partial<StyleRules<
  ComponentNameToClassKey["MuiTableCell"]
>> = {
  root: {
    ...typography.body1,
    borderBottom: `1px solid ${paletteOptions.divider}`
  }
};

export default MuiTableCell;
