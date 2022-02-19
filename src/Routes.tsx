import React, { lazy } from "react";
import { Redirect } from "react-router-dom";
import { RouteConfig, RouteConfigComponentProps } from "react-router-config";
import DashboardLayout from "./layouts/Dashboard";
import { parseAddOrderUrlSearchParams } from "./views/Orders/OrderPage";
import * as History from "history";
import { OrderPage } from "./views/Orders";
import { DocumentsPage } from "./views/Documents";
import { Dashboard, Invoices, Subscriptions, Users } from "./views";
import Customers from "./views/Customers/Customers";
import CustomerDashboard from "./views/Customers/CustomerDashboard";
import ResellerDashboard from "./views/Resellers/ResellerDashboard";
import { UserDashboard } from "./views/Users";


const loginPath = "/auth/login";
const loginCallbackPath = "/auth/callback";
const silentRefreshCallbackPath = "/auth/silent-refresh";
const customerPath = "/customers/:customerId";
const resellerPath = "/resellers/:customerId";
const userPath = "/users/:userId";
const ordersPath = "/orders";
const addOrderPath = ordersPath + "/add";
const orderPath = ordersPath + "/:orderId";
const subscriptionsPath = "/subscriptions";

const getReferrer = (location: Location): History.Location | undefined =>
  !location.pathname.startsWith(loginPath)
    ? {...window.location, state: null}
    : undefined;

const ordersTabs = {
  exact: true,
  component: lazy(() => import("./views/Orders"))
}

const Routes: RouteConfig[] = [
  {
    path: "/",
    exact: true,
    component: () => <Redirect to="/dashboard"/>
  },
  // TODO: Errors
  {
    route: "*",
    component: DashboardLayout,
    routes: [
      {
        path: "/dashboard",
        exact: true,
        component: () => <Dashboard/>,
      },
      {
        path: ordersPath,
        ...ordersTabs
      },
      {
        path: ordersPath + "/draft",
        ...ordersTabs
      },
      {
        path: ordersPath + "/paid",
        ...ordersTabs
      },
      {
        path: ordersPath + "/complete",
        ...ordersTabs
      },
      {
        path: ordersPath + "/cancelled",
        ...ordersTabs
      },
      {
        path: ordersPath + "/all",
        ...ordersTabs
      },
      {
        path: addOrderPath,
        exact: true,
        component: (props: RouteConfigComponentProps<any>) => {
          if (props.location.search?.length > 0) {
            const state = parseAddOrderUrlSearchParams(props.location.search);
            return <Redirect to={{pathname: addOrderPath, state: state}} />;
          }
          return <OrderPage/>;
        }
      },
      {
        path: orderPath,
        exact: true,
        component: () => <OrderPage/>
      },
      {
        path: '/documents',
        exact: true,
        component: () => <DocumentsPage />
      },
      {
        path: "/invoices",
        exact: true,
        component: () => <Invoices/>
      },
      {
        path: subscriptionsPath + "/:tab",
        exact: true,
        component: () => <Subscriptions/>
      },
      {
        path: "/customers",
        exact: true,
        component: () => <Customers/>
      },
      {
        path: customerPath,
        exact: true,
        component: () => <CustomerDashboard/>
      },
      {
        path: resellerPath,
        exact: true,
        component: () => <ResellerDashboard/>
      },
      {
        path: "/users",
        exact: true,
        component: () => <Users/>
      },
      {
        path: userPath,
        exact: true,
        component: () => <UserDashboard/>
      },
    ]
  }
];

export { getReferrer, loginPath, loginCallbackPath, silentRefreshCallbackPath, customerPath, resellerPath, userPath, ordersPath, orderPath, addOrderPath, subscriptionsPath };
export default Routes;
