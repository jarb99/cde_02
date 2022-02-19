import * as React from "react";
import { Badge, Tooltip } from "@material-ui/core";
import LicenseType from "../models/LicenseType";
import DesktopWindowsIcon from "@material-ui/icons/DesktopWindows";
import BusinessIcon from "@material-ui/icons/Business";


interface LicenseIconProps {
  licenseType: LicenseType;
  quantity?: number;
}

const LicenseIcon: React.FC<LicenseIconProps> = (props) => {
  return (
    <Tooltip title={props.licenseType.toString()}>
      <Badge badgeContent={props.quantity} color="primary">
        {props.licenseType === LicenseType.Standalone
          ? <DesktopWindowsIcon fontSize="small"/>
          : <BusinessIcon fontSize="small"/>
        }
      </Badge>
    </Tooltip>
  );
};

export default LicenseIcon;
