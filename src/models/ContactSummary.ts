import ContactPerson from "./ContactPerson";

interface ContactSummary {
  id: string;
  isActive: boolean;
  contactName: string;
  location: string;
  contactPersons: ContactPerson[];
  updatedDateTime: Date;
}

export default ContactSummary;