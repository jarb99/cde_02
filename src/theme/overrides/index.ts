import { Overrides as CoreOverrides } from "@material-ui/core/styles/overrides";
import { StyleRules } from "@material-ui/core/styles/withStyles";
import { ToggleButtonClassKey } from "@material-ui/lab";

import MuiButton from "./MuiButton";
import MuiCardActions from "./MuiCardActions";
import MuiCardContent from "./MuiCardContent";
import MuiCardHeader from "./MuiCardHeader";
import MuiChip from "./MuiChip";
import MuiIconButton from "./MuiIconButton";
import MuiInputBase from "./MuiInputBase";
import MuiLinearProgress from "./MuiLinearProgress";
import MuiListItem from "./MuiListItem";
import MuiListItemIcon from "./MuiListItemIcon";
import MuiOutlinedInput from "./MuiOutlinedInput";
import MuiPaper from "./MuiPaper";
import MuiTableCell from "./MuiTableCell";
import MuiTableHead from "./MuiTableHead";
import MuiTableRow from "./MuiTableRow";
import MuiToggleButton from "./MuiToggleButton";
import MuiTypography from "./MuiTypography";

// Add overrides for non-core components
// https://github.com/mui-org/material-ui/issues/12164#issuecomment-564041219
interface Overrides extends CoreOverrides {
  MuiToggleButton?:
    | Partial<StyleRules<ToggleButtonClassKey>>
    | undefined;
}

const overrides: Overrides = {
  MuiButton,
  MuiCardActions,
  MuiCardContent,
  MuiCardHeader,
  MuiChip,
  MuiIconButton,
  MuiInputBase,
  MuiLinearProgress,
  MuiListItem,
  MuiListItemIcon,
  MuiOutlinedInput,
  MuiPaper,
  MuiTableCell,
  MuiTableHead,
  MuiTableRow,
  MuiToggleButton,
  MuiTypography
};

export default overrides;
