import React, { useCallback } from "react";
import Search, { FastSearchFixtures } from "../Search/Search";
import { getCustomers } from "../../api/API";
import CustomerSearchResult from "./CustomerSearchResult";
import CustomerSummary from "../../models/CustomerSummary";
import { CancelToken } from "axios";


interface CustomerSearchProps {
  selectedCustomer: CustomerSummary | null;
  onSelectionChanged: (customer: CustomerSummary) => void;
  fixtures?: FastSearchFixtures;
}

const CustomerSearch: React.FC<CustomerSearchProps> = (props) => {
  const {selectedCustomer, onSelectionChanged, fixtures} = props;
  const fetch = useCallback((search?: string, pageNo?: number, pageSize?: number, cancelToken?: CancelToken) => getCustomers(undefined, search, pageNo, pageSize, cancelToken), []);
  
  return (
    <Search selectedItem={selectedCustomer} 
            onSelectionChanged={onSelectionChanged} 
            fetch={fetch}
            renderResult={(customer: CustomerSummary) => <CustomerSearchResult customer={customer}/>} 
            fixtures={fixtures}/>
  );
};

export default CustomerSearch;