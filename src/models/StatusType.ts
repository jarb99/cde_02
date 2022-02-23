enum statusType { //TODO: types of  workflow nodes - to be made editable
    A = "Status A (Approved)",
    B = "Status B (Approved with comments)",
    C = "Status C (Rejected with comments)",
    teamReview = "Team Review",
    leadReview = "Lead Designer Review",
    clientReview = "Client Review",
    contractorReview = "Contractor Review"
  }
  
  export default statusType;
  