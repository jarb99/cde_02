import * as React from "react";
import XeroDeepLink, { useXeroDeepLink } from "../../components/XeroDeepLink";

interface XeroContactLinkProps {
  contactId: string;
}

const getContactRedirectUrl = (contactId: string): string =>
  `/Contacts/View/${contactId}`;

const useXeroContactLink = (): ((contactId: string) => string) => {
  const getXeroDeepLink = useXeroDeepLink();

  return (contactId: string): string =>
    getXeroDeepLink(getContactRedirectUrl(contactId));
};

const XeroContactLink: React.FC<XeroContactLinkProps> = (props) => {
  return (
    <XeroDeepLink redirectUrl={getContactRedirectUrl(props.contactId)}>
      {props.children}
    </XeroDeepLink>
  );
};

export { useXeroContactLink };
export default XeroContactLink;