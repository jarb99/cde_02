import * as React from "react";
import XeroDeepLink, { useXeroDeepLink } from "../../components/XeroDeepLink";

interface XeroInvoiceLinkProps {
  invoiceId: string;
}

const getInvoiceRedirectUrl = (invoiceId: string): string =>
  `/AccountsReceivable/View.aspx?InvoiceID=${invoiceId}`;

const useXeroInvoiceLink = (): ((invoiceId: string) => string) => {
  const getXeroDeepLink = useXeroDeepLink();

  return (invoiceId: string): string =>
    getXeroDeepLink(getInvoiceRedirectUrl(invoiceId));
};

const XeroInvoiceLink: React.FC<XeroInvoiceLinkProps> = (props) => {
  return (
    <XeroDeepLink redirectUrl={getInvoiceRedirectUrl(props.invoiceId)}>
      {props.children}
    </XeroDeepLink>
  );
};

export { useXeroInvoiceLink };
export default XeroInvoiceLink;