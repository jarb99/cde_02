interface InvoiceSummary {
  id: string;
  invoiceNumber: string | null;
  contactId: string | null;
  contactName: string | null;
  date: Date | null;
  updatedDate: Date | null;
  dueDate: Date | null;
  status: string | null;
  subtotal: number | null;
  totalTax: number | null;
  total: number | null;
  amountDue: number | null;
  amountPaid: number | null;
  amountCredited: number | null;
}

export default InvoiceSummary;