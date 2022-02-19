import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { Dialog, DialogActions, DialogContent, useMediaQuery, useTheme } from "@material-ui/core";
import DialogHeader from "../../components/DialogHeader";
import FormActions from "../../components/FormActions";
import ReceiptOutlinedIcon from '@material-ui/icons/ReceiptOutlined';
import InvoiceList from "./InvoiceList";
import InvoiceSummary from "../../models/InvoiceSummary";
import { AxiosResponse, CancelToken } from "axios";
import useApiFetch from "../../api/ApiFetch";

interface InvoiceSelectDialogProps {
  open: boolean;
  showProgress?: boolean;
  disabled?: boolean;
  errorMessage?: string;
  selectedInvoices: string[];
  onFetch: (cancelToken?: CancelToken) => Promise<AxiosResponse<InvoiceSummary[]>>
  onSave: (selectedInvoices: InvoiceSummary[]) => void;
  onCancel: () => void;
}

const InvoiceSelectDialog: React.FC<InvoiceSelectDialogProps> = (props) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
 
  const shouldFetch = useCallback(() => props.open, [props.open]);
  const [fetchState] = useApiFetch<InvoiceSummary[]>(props.onFetch, shouldFetch);

  const [selectedInvoices, setSelectedInvoices] = useState<string[]>(props.selectedInvoices);
  
  useEffect(() => setSelectedInvoices(props.selectedInvoices), [props.selectedInvoices]);
  
  const handleInvoiceSelectionToggle = (value: string) => {
    const currentIndex = selectedInvoices.indexOf(value);
    const nextSelection = [...selectedInvoices];
    
    if (currentIndex === -1) {
      nextSelection.push(value);
    } else {
      nextSelection.splice(currentIndex, 1);
    }

    setSelectedInvoices(nextSelection);
  };
  
  const handleSubmit = () => {
    props.onSave(
      fetchState.data!
      .filter(invoice =>
        selectedInvoices.some(id => id === invoice.id)));
  };

  return (
    <Dialog fullWidth={true}
            onClose={props.onCancel}
            open={props.open}
            fullScreen={smDown}
    >
      <DialogHeader title="Choose Invoices"
                    avatar={<ReceiptOutlinedIcon/>}
                    onClose={props.onCancel} 
                    showProgress={fetchState.isFetching || props.showProgress}
                    disableClose={props.disabled}/>

      <DialogContent>
        <InvoiceList disabled={props.disabled}
                     selectedInvoices={selectedInvoices} 
                     invoices={fetchState.data || []} 
                     onInvoiceSelectionToggle={handleInvoiceSelectionToggle}
                     isLoading={fetchState.isFetching}/>
      </DialogContent>

      <DialogActions>
        <FormActions disabled={props.disabled}
                     submitErrorMessage={props.errorMessage}
                     submitDisabled={
                       fetchState.isFetching || 
                       !fetchState.data || 
                       fetchState.data.length === 0 || 
                       selectedInvoices.length === 0
                     }
                     submitText="Save"
                     onSubmit={handleSubmit}
                     onCancel={props.onCancel}
        />
      </DialogActions>
    </Dialog>
  );
};

export default InvoiceSelectDialog;
