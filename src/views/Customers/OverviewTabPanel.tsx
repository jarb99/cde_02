import * as React from "react";
import CustomerOrdersRecent from "./CustomerOrdersRecent";
import { createCurrentCustomerLicenses } from "./CustomerLicenses";
import { createCurrentCustomerSubscriptions } from "./CustomerSubscriptions";


interface OverviewTabPanelProps {
  userId: number;
}

const OverviewTabPanel: React.FC<OverviewTabPanelProps> = (props: OverviewTabPanelProps) => {

  return (
    <>
      {createCurrentCustomerSubscriptions(props.userId)}
      {createCurrentCustomerLicenses(props.userId)}
      <CustomerOrdersRecent customerId={props.userId}/>
    </>
  );
};

export default OverviewTabPanel;