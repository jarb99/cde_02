import React, { lazy } from "react";
import { Redirect } from "react-router-dom";
import { RouteConfig, RouteConfigComponentProps } from "react-router-config";
import DashboardLayout from "./layouts/Dashboard";
import { Projects, Dashboard, Subscriptions, Settings, Documents, Workflows, Timeline } from "./views";

const projectID = '/<projectID>'; // TODO: LINK ACTUAL PROJECT ID

const Routes: RouteConfig[] = [
  {
    path: "/",
    exact: true,
    component: () => <Redirect to="/documents"/>
  },
  {
    route: "*",
    component: DashboardLayout,
    routes: [
      {
        path: projectID + "/projects",
        exact: true,
        component: () => <Projects/>,
      },
      {
        path: projectID + "/dashboard",
        exact: true,
        component: () => <Dashboard/>,
      },
      {
        path: projectID + "/workflows",
        exact: true,
        component: () => <Workflows/>,
      },
      {
        path: projectID + "/timeline",
        exact: true,
        component: () => <Timeline/>,
      },
      {
        path: projectID + '/documents',
        exact: true,
        component: () => <Documents />
      },
      {
        path: "/settings",
        exact: true,
        component: () => <Settings/>
      }
    ]
  }
];

export default Routes;
