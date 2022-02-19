import * as React from "react";
import { Link } from "@material-ui/core";
import { useContext } from "react";
import Configuration from "../configuration/configuration";
import { ConfigurationContext } from "../configuration/ConfigurationContextProvider";

interface XeroDeepLinkProps {
  redirectUrl: string;
}

const useXeroDeepLink = (): ((redirectUrl: string) => string) => {
  const config = useContext<Configuration | null>(ConfigurationContext);

  return (redirectUrl: string): string =>
    `https://go.xero.com/organisationlogin/default.aspx?shortcode=${config?.xero.shortCode}&redirecturl=${redirectUrl}`;
}

const XeroDeepLink: React.FC<XeroDeepLinkProps> = (props) => {
  const getXeroDeepLink = useXeroDeepLink();
  
  return (
    <Link href={getXeroDeepLink(props.redirectUrl)}>
      {props.children || <span>Open in Xero</span>}
    </Link>
  );
};

export { useXeroDeepLink };
export default XeroDeepLink;