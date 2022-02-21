import { NavItemConfig } from "./NavBar";
import { SvgIconProps } from "@material-ui/core";
import DashboardIconElement from "@material-ui/icons/DashboardOutlined";
import PeopleOutlineElement from "@material-ui/icons/PeopleOutlined";
import ListAltOutlinedElement from "@material-ui/icons/ListAltOutlined";
import ReceiptOutlinedElement from "@material-ui/icons/ReceiptOutlined";
import ConfirmationNumberOutlinedElement from "@material-ui/icons/ConfirmationNumberOutlined";
import EventAvailableOutlinedIconElement from '@material-ui/icons/EventAvailableOutlined';
import EventBusyOutlinedIconElement from '@material-ui/icons/EventBusyOutlined';
import HistoryIconElement from '@material-ui/icons/History';
import AccountBoxIconElement from '@material-ui/icons/AccountBox';
import SettingsIcon from '@material-ui/icons/Settings';
import TimelineIcon from '@material-ui/icons/Timeline';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import HomeWorkIcon from '@material-ui/icons/HomeWork';

// JSX.Element -> React.ComponentType<SvgIconProps>
// see https://stackoverflow.com/a/52559982
const DashboardIcon: React.ComponentType<SvgIconProps> = DashboardIconElement;
const PeopleOutlinedIcon: React.ComponentType<SvgIconProps> = PeopleOutlineElement;
const ListAltOutlinedIcon: React.ComponentType<SvgIconProps> = ListAltOutlinedElement;
const ReceiptOutlinedIcon: React.ComponentType<SvgIconProps> = ReceiptOutlinedElement;
const ConfirmationNumberOutlinedIcon: React.ComponentType<SvgIconProps> = ConfirmationNumberOutlinedElement;
const EventAvailableOutlinedIcon: React.ComponentType<SvgIconProps> = EventAvailableOutlinedIconElement;
const EventBusyOutlinedIcon: React.ComponentType<SvgIconProps> = EventBusyOutlinedIconElement;
const HistoryIcon: React.ComponentType<SvgIconProps> = HistoryIconElement;
const AccountBoxIcon:  React.ComponentType<SvgIconProps> = AccountBoxIconElement;

const NavItems: NavItemConfig[] = [
  {
    title: "Projects",
    href: "/projects",
    icon: DashboardIcon
  },
  {
    title: "16008: JUBLIEE...",
    href: "/<projectID>", // TODO: LINK ACTUAL PROJECT ID
    icon: HomeWorkIcon,
    isOpen: true,
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: DashboardIcon
      },
      {
        title: "Documents",
        href: "/documents",
        icon: ListAltOutlinedIcon
      },
      {
        title: "Timeline",
        href: "/timeline",
        icon: TimelineIcon
      },
      {
        title: "Workflows",
        href: "/workflows",
        icon: AccountTreeIcon
      },
      {
        title: "Subscriptions",
        href: "/subscriptions",
        icon: ConfirmationNumberOutlinedIcon
      },
      {
        title: "Settings",
        href: "/settings",
        icon: SettingsIcon
      },
    ]
  },
  {
    title: "Open Items",
    href: "/openitems",
    icon: PeopleOutlinedIcon
  },
  {
    title: "User",
    href: "/users",
    icon: PeopleOutlinedIcon
  },
];

export default NavItems;
