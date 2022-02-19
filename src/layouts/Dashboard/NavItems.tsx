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
    title: "Project",
    href: "/dashboard",
    icon: DashboardIcon
  },
  {
    title: "Documents",
    href: "/documents",
    icon: ListAltOutlinedIcon
  },
  {
    title: "Invoices",
    href: "/invoices",
    icon: ReceiptOutlinedIcon
  },
  {
    title: "Subscriptions",
    href: "/subscriptions",
    icon: ConfirmationNumberOutlinedIcon,
    items: [
      {
        title: "Current",
        href: "/current",
        icon: EventAvailableOutlinedIcon,
      },
      {
        title: "Expired",
        href: "/expired",
        icon: EventBusyOutlinedIcon,
      },
      {
        title: "All",
        href: "/all",
        icon: HistoryIcon,
      },
    ]
  },
  {
    title: "Customers",
    href: "/customers",
    icon: AccountBoxIcon
  },
  {
    title: "Users",
    href: "/users",
    icon: PeopleOutlinedIcon
  }
];

export default NavItems;
