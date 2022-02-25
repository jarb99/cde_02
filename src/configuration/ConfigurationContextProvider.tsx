import * as React from "react";
import Configuration from "./configuration";
import useApiFetch from "../api/ApiFetch";
import { getConfiguration } from "../api/API";

const ConfigurationContext = React.createContext<Configuration | null>(null);

const ConfigurationContextProvider: React.FC = (props) => {
  const [configuration] = useApiFetch<Configuration>(getConfiguration);

  console.log('config', configuration);

  return (
    <ConfigurationContext.Provider value={configuration.data}>
      {props.children}
    </ConfigurationContext.Provider>
  );
};

export { ConfigurationContext };
export default ConfigurationContextProvider;