import { StyleRules } from "@material-ui/core";
import { ComponentNameToClassKey } from "@material-ui/core/styles/overrides";

const MuiTypography: Partial<StyleRules<
  ComponentNameToClassKey["MuiTypography"]
>> = {
  gutterBottom: {
    marginBottom: 8
  }
};

export default MuiTypography;
